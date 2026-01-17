import { NextRequest, NextResponse } from 'next/server';
import { readEnquiries, addEnquiry, deleteEnquiry, updateEnquiryStatus, updateEnquiriesStatus, deleteEnquiries } from '@/lib/enquiryUtils';

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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ids, status } = body;

    // Handle batch update
    if (ids && Array.isArray(ids)) {
      if (!status || (status !== 'pending' && status !== 'solved')) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      const count = updateEnquiriesStatus(ids, status);
      return NextResponse.json({ message: 'Enquiries updated successfully', count });
    }

    // Handle single update
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing id or status' },
        { status: 400 }
      );
    }

    if (status !== 'pending' && status !== 'solved') {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const success = updateEnquiryStatus(id, status);

    if (!success) {
      return NextResponse.json(
        { error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Enquiry status updated successfully' });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    const idsParam = searchParams.get('ids');

    // Handle batch delete
    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean);
      const count = deleteEnquiries(ids);
      return NextResponse.json({ message: 'Enquiries deleted successfully', count });
    }

    // Handle single delete
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
