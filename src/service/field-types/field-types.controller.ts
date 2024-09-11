import { Controller, Get } from '@nestjs/common';

@Controller('field-types')
export class FieldTypesController {
    constructor() {}

    @Get()
    getAll() {
        return [
            {
                id: 'text',
                name: 'Texte',
            },
            {
                id: 'url',
                name: 'URL',
            },
            {
                id: 'tel',
                name: 'Téléphone',
            },
            {
                id: 'number',
                name: 'Nombre',
            },
            {
                id: 'range',
                name: 'Plage',
            },
            {
                id: 'date',
                name: 'Date',
            },
            {
                id: 'checkbox',
                name: 'Case à cocher',
            },
            {
                id: 'radio',
                name: 'Bouton radio',
            },
            {
                id: 'file',
                name: 'Fichier',
            },
            {
                id: 'textarea',
                name: 'Zone de texte',
            },
            {
                id: 'select',
                name: 'Liste déroulante',
            },
        ];
    }
}
