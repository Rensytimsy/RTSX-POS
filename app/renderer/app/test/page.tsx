"use client"

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function POSTerminalScreen() {
    const [sessionId, setSessionId] = useState<string>('');
    const [cartItems, setCartItems] = useState<string[]>([]);
    const [wsStatus, setWsStatus] = useState<string>('Disconnected');

    useEffect(() => {
        // Generate a secure unique terminal session key
        const terminalSession = `term_${Math.random().toString(36).substring(2, 10)}`;
        setSessionId(terminalSession);

        // Open connection to Django Channels
        const socket = new WebSocket(`ws://localhost:8000/ws/scanner/${terminalSession}/`);

        socket.onopen = () => setWsStatus('Online');
        socket.onclose = () => setWsStatus('Offline');

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status === 'SUCCESS' && data.barcode) {
                // Append newly scanned barcode directly to cart
                setCartItems((prevItems) => [data.barcode, ...prevItems]);
            }
        };

        return () => socket.close();
    }, []);

    // Web pairing URL pointing to hosted scanner route
    const mobileScannerUrl = `https://39c8-102-209-57-213.ngrok-free.app/mobile/scan?session=${sessionId}&shop=rtstudio-stores`;

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
            {/* Main Terminal View */}
            <div style={{ flex: 1, padding: '2rem' }}>
                <h1>POS Register Terminal</h1>
                <p>Terminal Status: <strong>{wsStatus}</strong></p>

                <h3>Scanned Cart Items</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {cartItems.map((item, index) => (
                        <li key={index} style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb', fontFamily: 'monospace' }}>
                            Barcode: {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Sidebar Scanner Companion Widget */}
            <div style={{ width: '300px', borderLeft: '1px solid #e5e7eb', padding: '1.5rem', textAlign: 'center' }}>
                <h4>Mobile Scanner Backup</h4>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    Scan this QR code with a mobile camera to use as a backup barcode reader.
                </p>

                {sessionId && (
                    <div style={{ padding: '1rem', background: '#fff', display: 'inline-block', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <QRCodeSVG value={mobileScannerUrl} size={180} />
                    </div>
                )}

                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem', wordBreak: 'break-all' }}>
                    Session: {sessionId}
                </p>
            </div>
        </div>
    );
}