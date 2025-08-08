export function parseHashtagsToLinks(caption: string): string {
    const hashtagRegex = /#(\w+)/g;
    return caption.replace(hashtagRegex, (match, tag) => {
        return `<a href="/search?${encodeURIComponent(tag)}" class="text-blue-500 hover:underline">${match}</a>`;
    });
}