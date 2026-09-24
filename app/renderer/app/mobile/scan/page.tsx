"use client"

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function MobileScannerComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Extract query parameters: ?session=term_test123&shop=main-store
    const session = searchParams.get('session');
    const shop = searchParams.get('shop') || 'default';

    const [lastScannedCode, setLastScannedCode] = useState<string>('');
    const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Connected' | 'Disconnected'>('Connecting');

    const socketRef = useRef<WebSocket | null>(null);
    const scanCooldownRef = useRef<boolean>(false);

    useEffect(() => {
        if (!session) return;

        const backendHost = process.env.NEXT_PUBLIC_DJANGO_WS_URL || '127.0.0.1:8000';

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

        // If on ngrok and NOT using rewrites, point directly to a second Django ngrok URL
        const host = window.location.host.includes(':3000')
            ? 'https://0382-102-209-57-213.ngrok-free.app'
            : window.location.host;

        const socketUrl = `${wsProtocol}//${host}/ws/scanner/${session}/`;

        const socket = new WebSocket(socketUrl);
        socketRef.current = socket;

        socket.onopen = () => setConnectionStatus('Connected');
        socket.onclose = () => setConnectionStatus('Disconnected');
        socket.onerror = (err) => {
            console.error('WebSocket Error:', err);
            setConnectionStatus('Disconnected');
        };

        // 2. Initialize HTML5 Camera Reader
        let scanner: Html5QrcodeScanner | null = new Html5QrcodeScanner(
            "camera-reader",
            {
                fps: 15,
                qrbox: { width: 280, height: 160 },
                aspectRatio: 1.0,
            },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                // Prevent duplicate triggers (1.5s cooldown)
                if (scanCooldownRef.current) return;

                scanCooldownRef.current = true;
                setLastScannedCode(decodedText);

                // Haptic tactile vibration confirmation
                if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                    navigator.vibrate(200);
                }

                // Send scan event through WebSocket
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: 'SCAN_EVENT',
                        barcode: decodedText,
                        shop_slug: shop
                    }));
                }

                // Reset cooldown after 1.5 seconds
                setTimeout(() => {
                    scanCooldownRef.current = false;
                }, 1500);
            },
            (errorMessage) => {
                // Ignore standard frame scan misfires
            }
        );

        // Clean up connections on unmount
        return () => {
            if (scanner) {
                scanner.clear().catch((err) => console.error("Scanner cleanup error:", err));
                scanner = null;
            }
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        };
    }, [session, shop]);

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>Backup Barcode Scanner</h2>

            {!session ? (
                <div style={{ padding: '1rem', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '8px' }}>
                    ⚠️ Missing <strong>session</strong> parameter in URL. Scan the QR code from the POS terminal again.
                </div>
            ) : (
                <>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        backgroundColor: connectionStatus === 'Connected' ? '#d1fae5' : '#fee2e2',
                        color: connectionStatus === 'Connected' ? '#065f46' : '#991b1b',
                        marginBottom: '1rem'
                    }}>
                        Status: {connectionStatus}
                    </div>

                    <div id="camera-reader" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}></div>

                    {lastScannedCode && (
                        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Last Transmitted Barcode:</p>
                            <strong style={{ fontSize: '1.2rem', color: '#111827' }}>{lastScannedCode}</strong>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}