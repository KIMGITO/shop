export const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
    });
    // Example output: "Dec 31, 2023"
};