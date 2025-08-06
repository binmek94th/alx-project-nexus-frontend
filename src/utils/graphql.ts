export const decodeGlobalId = (globalId: string) => {
    const decoded = atob(globalId);
    const [, id] = decoded.split(':');
    return id;
};

export const encodeGlobalId = (globalId: string) => {
    return btoa(globalId);
}