export const VALIDATION_MESSAGES: Record<string, string> = {
    '100': 'Book title is mandatory',
    '101': 'Author name is mandatory',
    '102': 'The ISBN is mandatory',
    '103': 'The synopsis is mandatory',

}

export function mapValidationErrors(errors: string[] | string): string[] {
    if (!errors) return [];

    const errorList = Array.isArray(errors) ? errors : [errors];

    return errorList.map(code => 
        VALIDATION_MESSAGES[code] || `Validation error not known (Code: ${code})`
    );
}