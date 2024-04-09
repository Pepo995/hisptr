export const Config = {
  basename: process.env.NEXT_PUBLIC_BASENAME,
  baseUrl: process.env.NEXT_PUBLIC_BASENAME_URL,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  apiVersion: process.env.NEXT_PUBLIC_API_VERSION,

  //encryption token
  tokenEncr: process.env.NEXT_PUBLIC_API_ENCRYPTION_KEY,
  //API url endpoints
  apiEndPoints: {
    //jotform
    jotformApiKey: process.env.NEXT_PUBLIC_API_JOTFORM,
    jotformFormId: process.env.NEXT_PUBLIC_JOTFORM_FORM_ID,
  },
};
