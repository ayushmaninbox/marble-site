import { NextRequest, NextResponse } from 'next/server';
import { readEnquiries, addEnquiry, deleteEnquiry } from '@/lib/enquiryUtils';

export async function GET() {
  try {
    const enquiries = readEnquiries();
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, productCategory, productName, quantity, message } = body;
    
    if (!firstName || !lastName || !email || !phone || !productCategory || !productName || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newEnquiry = addEnquiry({
      firstName,
      lastName,
      email,
      phone,
      productCategory,
      productName,
      quantity: parseInt(quantity),
      message: message || '',
    });
    
    return NextResponse.json(newEnquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing enquiry ID' },
        { status: 400 }
      );
    }
    
    const success = deleteEnquiry(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}
