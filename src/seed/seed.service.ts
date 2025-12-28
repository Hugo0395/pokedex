import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response-interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); /*Elimina todos los pokemons*/
    const response = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonstoInsert: { name: string; no: number }[] = [];

    response.data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      pokemonstoInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonstoInsert);

    // const insertPromisesArray: Promise<any>[] = [];
    // response.data.results.forEach(({ name, url }) => {
    //   const segments = url.split('/');
    //   const no: number = +segments[segments.length - 2];
    //   insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    // });
    // await Promise.all(insertPromisesArray);

    // await Promise.all(
    //   response.data.results.map(async ({ name, url }) => {
    //     const segments = url.split('/');
    //     const no: number = +segments[segments.length - 2];
    //     return this.pokemonModel.create({
    //       name,
    //       no,
    //     });
    //   }),
    // );

    // response.data.results.forEach(({ name, url }) => {
    //   const segments = url.split('/');
    //   const no: number = +segments[segments.length - 2];

    //   await this.pokemonService.create({
    //     name,
    //     no,
    //   });
    //   console.log(name, no);
    // });
    return 'Seed executed';
  }
}
