import { Controller, Get } from '@nestjs/common';

@Controller('field-types')
export class FieldTypesController {
    constructor() {}

    @Get()
    getAll() {
        return [
            {
                typeName: 'text',
                name: 'Texte',
            },
            {
                typeName: 'url',
                name: 'URL',
            },
            {
                typeName: 'tel',
                name: 'Téléphone',
            },
            {
                typeName: 'number',
                name: 'Nombre',
            },
            {
                typeName: 'range',
                name: 'Plage',
            },
            {
                typeName: 'date',
                name: 'Date',
            },
            {
                typeName: 'checkbox',
                name: 'Case à cocher',
            },
            {
                typeName: 'radio',
                name: 'Bouton radio',
            },
            {
                typeName: 'file',
                name: 'Fichier',
            },
            {
                typeName: 'textarea',
                name: 'Zone de texte',
            },
            {
                typeName: 'select',
                name: 'Liste déroulante',
            },
        ];
    }
}
