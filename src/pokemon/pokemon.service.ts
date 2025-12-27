import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();

      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error: any) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    try {
      const pokemons = await this.pokemonModel.find();
      if (!pokemons) throw new NotFoundException('No pokemons found');
      return pokemons;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }
    //mongoId
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    //name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon with term ${term} was not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return this.findOne(term); // asi se hace porque el update no devuelve el objeto actualizado
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);

    // try {
    //   if (pokemon) {
    //     await pokemon.deleteOne();
    //     return `Pokemon with id ${id} was deleted`;
    //   }
    // } catch (error) {
    //   this.handleExceptions(error);
    // }
    const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne({
      _id: id,
    });
    if (!acknowledged)
      throw new InternalServerErrorException(
        'Cant delete pokemon, Internal server error',
      );
    if (deletedCount === 0)
      throw new NotFoundException(`Pokemon with id ${id} was not found`);

    const result = `Pokemon with id ${id} was deleted`;
    console.log(result);
    return result;
  }

  private handleExceptions(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === 11000) {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Pokemon already exists ${JSON.stringify(error?.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Cant create pokemon, Internal server error',
    );
  }
}
