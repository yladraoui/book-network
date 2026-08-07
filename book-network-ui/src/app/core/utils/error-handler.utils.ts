import { HttpErrorResponse } from "@angular/common/http";

export  function handleApiError(err:HttpErrorResponse): string[] {
    let errorBody: any = err.error;

    if (errorBody?.validationErrors?.length > 0) {
        return errorBody.validationErrors;
    }
    if (errorBody?.busnessErrorDescription) {
        return [errorBody.busnessErrorDescription];
    }
    if (errorBody?.error) {
        return [errorBody.error];
    }

    return ['Une erreur est survenu lors du traitement de la requete'];
}