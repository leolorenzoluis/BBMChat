import { BlobServiceClient } from "@azure/storage-blob";

// export const runtime = 'edge'


export async function GET(req: Request,
  { params }: { params: { slug: string } }) {
  let slug = params.slug

  // If slug contains Sona then replace it to upper case and leave the rest as is
  const sona = 'Sona'
  if (slug.includes(sona)) {
    slug = slug.replace(sona, sona.toUpperCase())
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!)
  const containerClient = blobServiceClient.getContainerClient('content')

  const blobClient = containerClient.getBlobClient(slug);

  try {
    const buffer = await blobClient.downloadToBuffer();
    const response = new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    return new Response('Not found', { status: 404 });
  }
}