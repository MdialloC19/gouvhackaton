import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CitoyenService } from '../../citoyen/citoyen.service';
import { CreateCitoyenDto } from '../../citoyen/dto/create-citoyen.dto';
import { Citoyen } from '../../citoyen/citoyen.schema';
import * as bcrypt from 'bcrypt';
import { ApiTags, ApiBody, ApiResponse as SwaggerApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Citoyen Authentification') // Documentation Swagger pour regrouper les routes
@Injectable()
export class CitoyenAuthService {
  constructor(
    private readonly citoyenService: CitoyenService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valide si un citoyen existe avec le phoneNumber et le mot de passe
   * @param {string} phoneNumber - Le numéro de téléphone du citoyen
   * @param {string} pass - Le mot de passe du citoyen
   * @returns {Promise<Citoyen | null>} - Retourne le citoyen sans son mot de passe ou null si invalide
   * @throws {NotFoundException} - Si le citoyen n'est pas trouvé
   * @throws {UnauthorizedException} - Si le mot de passe est incorrect
   */
  @ApiOperation({ summary: 'Valider un citoyen avec phoneNumber et mot de passe' })
  @ApiBody({
    description: "Données d'identification du citoyen",
    schema: { example: { phoneNumber: '+33123456789', password: 'Str0ngP@ssw0rd!' } }
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Citoyen validé avec succès.',
    schema: {
      example: {
        _id: '60b91c202123af20d8b2f1e4',
        phoneNumber: '+33123456789',
        name: 'Jean',
        surname: 'Dupont',
        birthDate: '1990-05-15T00:00:00.000Z',
        job: 'Ingénieur',
        sex: 'M',
      }
    }
  })
  @SwaggerApiResponse({ status: 404, description: 'Citoyen non trouvé.' })
  @SwaggerApiResponse({ status: 401, description: 'Identifiants invalides.' })
  async validateCitoyen(phoneNumber: string, pass: string): Promise<Citoyen | null> {
    const citoyen = await this.citoyenService.findByPhoneNumber(phoneNumber);
    if (!citoyen) {
      throw new NotFoundException('Citoyen not found');
    }

    const isPasswordValid = await this.comparePassword(pass, citoyen.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...result } = citoyen.toObject();
    return result;
  }

  /**
   * Génère un token JWT pour le citoyen après une connexion réussie
   * @param {Citoyen} citoyen - Le citoyen pour lequel générer un token
   * @returns {Promise<{ citoyen: any, token: string }>} - Le citoyen et son token JWT
   */
  @ApiOperation({ summary: 'Générer un token JWT pour un citoyen après connexion' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Connexion réussie, token JWT généré.',
    schema: {
      example: {
        citoyen: {
          _id: '60b91c202123af20d8b2f1e4',
          phoneNumber: '+33123456789',
          name: 'Jean',
          surname: 'Dupont',
          birthDate: '1990-05-15T00:00:00.000Z',
          job: 'Ingénieur',
          sex: 'M',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjkxYzIwMjEyM2FmMjBkOGIyZjFlNCIsInBob25lTnVtYmVyIjoiKzMzMTIzNDU2Nzg5IiwiaWF0IjoxNjIxOTYzMzIyfQ.SZnwxnrc8j-FK2OcVROCeKEdHfbxxQJfZ5sEnYcwkS4'
      }
    }
  })
  public async login(citoyen: Citoyen): Promise<{ citoyen: any, token: string }> {
    const token = await this.generateToken(citoyen);
    return { citoyen, token };
  }

  /**
   * Crée un nouveau citoyen et génère un token JWT
   * @param {CreateCitoyenDto} createCitoyenDto - Les données pour créer un citoyen
   * @returns {Promise<{ citoyen: any, token: string }>} - Le citoyen créé et son token JWT
   * @throws {ConflictException} - Si le CNI existe déjà
   */
  @ApiOperation({ summary: 'Créer un citoyen et générer un token JWT' })
  @ApiBody({ type: CreateCitoyenDto, description: "Données pour créer un compte citoyen" })
  @SwaggerApiResponse({
    status: 201,
    description: 'Citoyen créé avec succès, token JWT généré.',
    schema: {
      example: {
        citoyen: {
          _id: '60b91c202123af20d8b2f1e4',
          CNI: '123456789012345',
          phoneNumber: '+33123456789',
          name: 'Jean',
          surname: 'Dupont',
          birthDate: '1990-05-15T00:00:00.000Z',
          job: 'Ingénieur',
          sex: 'M',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjkxYzIwMjEyM2FmMjBkOGIyZjFlNCIsInBob25lTnVtYmVyIjoiKzMzMTIzNDU2Nzg5IiwiaWF0IjoxNjIxOTYzMzIyfQ.SZnwxnrc8j-FK2OcVROCeKEdHfbxxQJfZ5sEnYcwkS4'
      }
    }
  })
  @SwaggerApiResponse({ status: 409, description: 'Le CNI existe déjà.' })
  @SwaggerApiResponse({ status: 500, description: 'Erreur interne du serveur.' })
  public async create(createCitoyenDto: CreateCitoyenDto): Promise<{ citoyen: any, token: string }> {
    const existingCNI = await this.citoyenService.findByCNI(createCitoyenDto.CNI);
    if (existingCNI) {
      throw new ConflictException('A citoyen with this CNI already exists');
    }

    const hashedPassword = await this.hashPassword(createCitoyenDto.password);

    const newCitoyen = await this.citoyenService.create({
      ...createCitoyenDto,
      password: hashedPassword,
    });

    const { password, ...result } = newCitoyen.toObject();
    const token = await this.generateToken(result);

    return { citoyen: result, token };
  }

  // Fonctions privées pour générer les tokens et hacher les mots de passe (pas besoin de Swagger pour ces méthodes)
  private async generateToken(citoyen: any): Promise<string> {
    return this.jwtService.signAsync(citoyen);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, storedPasswordHash: string): Promise<boolean> {
    return bcrypt.compare(password, storedPasswordHash);
  }
}
