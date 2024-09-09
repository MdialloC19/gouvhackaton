import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidateCreateUserPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        this.validatePhoneNumber(value.number);
        this.validateIdCardNumber(value.idCardNumber);
        return value;
    }

    private validatePhoneNumber(number: string): void {
        const numberRegex = /^(77|78|70|76|75)[0-9]{7}$/;
        if (!numberRegex.test(number)) {
            throw new BadRequestException(
                'Le numéro de téléphone doit être un numéro sénégalais valide.',
            );
        }
    }

    private validateIdCardNumber(idCardNumber: string): void {
        const idCardRegex = /^[12][0-9]{11}$/;
        if (!idCardRegex.test(idCardNumber)) {
            throw new BadRequestException(
                "Le numéro de la carte d'identité doit comporter 12 chiffres et commencer par 1 ou 2.",
            );
        }
    }
}
