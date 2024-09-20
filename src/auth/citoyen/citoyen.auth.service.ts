
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

  // Fonctions privées pour générer les tokens et hacher les mots de passe
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
