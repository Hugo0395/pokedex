import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsInt() //eslint-disable-line @typescript-eslint/no-unsafe-call
  @IsPositive() //eslint-disable-line @typescript-eslint/no-unsafe-call
  @Min(1) //eslint-disable-line @typescript-eslint/no-unsafe-call
  no: number;

  @IsString() //eslint-disable-line @typescript-eslint/no-unsafe-call
  @MinLength(1) //eslint-disable-line @typescript-eslint/no-unsafe-call
  name: string;
}
