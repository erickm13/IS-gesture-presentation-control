// Mock ESTABLE, compatible con toda tu app
export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () =>
          Promise.resolve({
            data: { pdf_content: "FAKE_PDF_DATA" },
            error: null,
          }),

        maybeSingle: () =>
          Promise.resolve({
            data: { pdf_content: "FAKE_PDF_DATA" },
            error: null,
          }),
      }),

      single: () =>
        Promise.resolve({
          data: { pdf_content: "FAKE_PDF_DATA" },
          error: null,
        }),

      maybeSingle: () =>
        Promise.resolve({
          data: { pdf_content: "FAKE_PDF_DATA" },
          error: null,
        }),
    }),

    insert: () =>
      Promise.resolve({
        data: [{ id: "pdf1", name: "test.pdf", created_at: new Date() }],
        error: null,
      }),

    update: () =>
      Promise.resolve({
        data: [{ updated: true }],
        error: null,
      }),

    delete: () =>
      Promise.resolve({
        data: null,
        error: null,
      }),
  }),

  storage: {
    from: () => ({
      upload: () =>
        Promise.resolve({
          data: { path: "fake-path/file.pdf" },
          error: null,
        }),

      download: () =>
        Promise.resolve({
          data: new Blob(["PDF_CONTENT"]),
          error: null,
        }),
    }),
  },
};

