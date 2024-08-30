import { PartialType } from '@nestjs/mapped-types';
import { CreateRendezvousDto } from './create-rendezvous.dto';

export class UpdateRendezvousDto extends PartialType(CreateRendezvousDto) {}
