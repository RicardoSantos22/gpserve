import { FindAllNewCarsQuery } from 'src/entities/newcar/dto/find-all-newcars-query';

/**
 * Regresa los filtros para que funcionene como consultas 'like'
 * @param queryParams 
 */
export function getRegexFilters(queryParams: FindAllNewCarsQuery){

  /** Objeto con los nuevos filtros en regex*/
  let regexQueryParams = {};

  Object.keys(queryParams).map((param) => {

    /**Si el parámetro no es nulo comeinza la validación */
    if (queryParams[param]) {

      /**
       * Si es un string se pasa a expresion regular
       * sino se recorre el arreglo para convertir cada valor en expresion regular
       */
      if (typeof queryParams[param] === 'string' || queryParams[param] instanceof String) {

        let paramValue = queryParams[param] as string;

        regexQueryParams[param] = new RegExp(paramValue, "i");

      } else {

        let queryValues = queryParams[param] as string[];
        let regexValuesList = [];

        queryValues.map((paramValue) => {
          regexValuesList.push(new RegExp(paramValue,"i"));
        })

        regexQueryParams[param] = regexValuesList;
      }

    }
  })

  return regexQueryParams;
}
