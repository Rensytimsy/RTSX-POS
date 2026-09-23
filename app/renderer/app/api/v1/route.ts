import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, NextRequest } from 'next/server'
 
type ResponseData = {
  message: string
}
 
export async function GET(req: NextRequest) {
    return NextResponse.json({ "message": "hello world!"})
}