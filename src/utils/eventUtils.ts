export const getWhereForInProcessEvents = (filter?: string) => ({
  OR: [
    { firstName: { contains: filter ?? "" } },
    { lastName: { contains: filter ?? "" } },
    { email: { contains: filter ?? "" } },
    { city: { contains: filter ?? "" } },
    { states: { name: { contains: filter ?? "" } } },
    { packages: { title: { contains: filter ?? "" } } },
    { type: { name: { contains: filter ?? "" } } },
  ],
});
