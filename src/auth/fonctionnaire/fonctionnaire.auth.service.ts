import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { FonctionnaireService } from '../../fonctionnaire/fonctionnaire.service';
  import { CreateFonctionnaireDto } from '../../fonctionnaire/dto/create-fonctionnaire.dto'
  import { Fonctionnaire } from '../../fonctionnaire/fonctionnaire.schema';
  import * as bcrypt from 'bcrypt';
  
  @Injectable()
  export class FonctionnaireAuthService {
    constructor(
      private readonly fonctionnaireService: FonctionnaireService,
      private readonly jwtService: JwtService,
    ) {}
  
    /**
     * Valide si un fonctionnaire existe avec l'email et le mot de passe
     * @param {string} email - L'email du fonctionnaire
     * @param {string} pass - Le mot de passe du fonctionnaire
     * @returns {Promise<Fonctionnaire | null>} - Retourne le fonctionnaire sans son mot de passe ou null si invalide
     * @throws {NotFoundException} - Si le fonctionnaire n'est pas trouvé
     * @throws {UnauthorizedException} - Si le mot de passe est incorrect
     */
    async validateFonctionnaire(email: string, pass: string): Promise<Fonctionnaire | null> {
      const fonctionnaire = await this.fonctionnaireService.findByEmail(email);
      if (!fonctionnaire) {
        throw new NotFoundException('Fonctionnaire not found');
      }
  
      const isPasswordValid = await this.comparePassword(pass, fonctionnaire.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const { password, ...result } = fonctionnaire.toObject();
      return result;
    }
  
    /**
     * Génère un token JWT pour le fonctionnaire après une connexion réussie
     * @param {Fonctionnaire} fonctionnaire - Le fonctionnaire pour lequel générer un token
     * @returns {Promise<{ fonctionnaire: any, token: string }>} - Le fonctionnaire et son token JWT
     */
    public async login(fonctionnaire: Fonctionnaire): Promise<{ fonctionnaire: any, token: string }> {
      const token = await this.generateToken(fonctionnaire);
      return { fonctionnaire, token };
    }
  
    /**
     * Crée un nouveau fonctionnaire et génère un token JWT
     * @param {CreateFonctionnaireDto} createFonctionnaireDto - Les données pour créer un fonctionnaire
     * @returns {Promise<{ fonctionnaire: any, token: string }>} - Le fonctionnaire créé et son token JWT
     * @throws {ConflictException} - Si l'email existe déjà
     */
    public async create(createFonctionnaireDto: CreateFonctionnaireDto): Promise<{ fonctionnaire: any, token: string }> {
      const existingEmail = await this.fonctionnaireService.findByEmail(createFonctionnaireDto.email);
      if (existingEmail) {
        throw new ConflictException('A fonctionnaire with this email already exists');
      }
  
      const hashedPassword = await this.hashPassword(createFonctionnaireDto.password);
  
      const newFonctionnaire = await this.fonctionnaireService.create({
        ...createFonctionnaireDto,
        password: hashedPassword,
      });
  
      const { password, ...result } = newFonctionnaire.toObject();
  
      const token = await this.generateToken(result);
  
      return { fonctionnaire: result, token };
    }
  
    /**
     * Génère un token JWT pour un fonctionnaire donné
     * @param {any} fonctionnaire - Les données du fonctionnaire
     * @returns {Promise<string>} - Le token JWT généré
     */
    private async generateToken(fonctionnaire: any): Promise<string> {
      return this.jwtService.signAsync(fonctionnaire);
    }
  
    /**
     * Hachage d'un mot de passe à l'aide de bcrypt
     * @param {string} password - Le mot de passe à hacher
     * @returns {Promise<string>} - Le mot de passe haché
     */
    private async hashPassword(password: string): Promise<string> {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    }
  
    /**
     * Compare un mot de passe brut avec un mot de passe haché
     * @param {string} password - Le mot de passe brut fourni par l'utilisateur
     * @param {string} storedPasswordHash - Le mot de passe haché stocké
     * @returns {Promise<boolean>} - Retourne vrai si les mots de passe correspondent, sinon faux
     */
    private async comparePassword(password: string, storedPasswordHash: string): Promise<boolean> {
      return bcrypt.compare(password, storedPasswordHash);
    }
  }
  
  