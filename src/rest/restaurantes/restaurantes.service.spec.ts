import { Test, TestingModule } from '@nestjs/testing'
import { RestaurantesService } from './restaurantes.service'
import { Repository } from 'typeorm'
import { Restaurante } from './entities/restaurante.entity'
import { RestaurantesMapper } from './mapper/restaurantes.mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { hash } from 'typeorm/util/StringUtils'
import { MacjavaNotificationsGateway } from '../../notifications/macjava-notifications.gateway'

describe('RestaurantesService', () => {
  let service: RestaurantesService
  let repositorio: Repository<Restaurante>
  let mapper: RestaurantesMapper
  let cache: Cache

  const restauranteMapperMock = {
    createDtoToEntity: jest.fn(),
    createDtoToEntity2: jest.fn(),
    updateDtoToEntity: jest.fn(),
  }

  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    del: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
    ttl: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
  }
  const notificationMock = {
    sendMessage: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantesService,
        { provide: getRepositoryToken(Restaurante), useClass: Repository },
        { provide: RestaurantesMapper, useValue: restauranteMapperMock },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
        {
          provide: MacjavaNotificationsGateway,
          useValue: notificationMock,
        },
      ],
    }).compile()

    service = module.get<RestaurantesService>(RestaurantesService)
    repositorio = module.get<Repository<Restaurante>>(
      getRepositoryToken(Restaurante),
    )
    mapper = module.get<RestaurantesMapper>(RestaurantesMapper)
    cache = module.get<Cache>(CACHE_MANAGER)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('deberia devolver todos los restaurantes', async () => {
      const restaurant: Restaurante = {
        ...new Restaurante(),
        id: 1,
        nombre: 'Restaurante 1',
        calle: 'Calle 1',
        localidad: 'Localidad 1',
        capacidad: 100,
      }
      jest.spyOn(cache, 'get').mockResolvedValue(undefined)
      const restaurantes: Restaurante[] = [restaurant]
      jest.spyOn(repositorio, 'find').mockResolvedValueOnce(restaurantes)
      const resultado = await service.findAll()
      expect(resultado).toEqual(restaurantes)
    })
  })
})
