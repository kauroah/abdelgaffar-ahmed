interface PagesFunctionContext {
  request: Request;
}

export const onRequest = ({ request }: PagesFunctionContext): Response => {
  return Response.json(
    { error: 'API route not found.' },
    {
      status: 404,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );
};
