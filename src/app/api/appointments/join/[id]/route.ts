import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const appointmentId = params.id;
        
        // Call your backend server to get fresh Agora credentials
        const response = await fetch(`http://3.14.150.170:5000/api/appointments/join/${appointmentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get video consultation credentials from backend');
        }

        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in video consultation join:', error);
        return NextResponse.json(
            { error: 'Failed to join video consultation' },
            { status: 500 }
        );
    }
} 