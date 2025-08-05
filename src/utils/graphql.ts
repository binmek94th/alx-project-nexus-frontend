export const decodeGlobalId = (globalId: string) => {
    const decoded = atob(globalId);
    const [, id] = decoded.split(':');
    return id;
};