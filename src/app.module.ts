import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  DataBaseMongoDBConfigModule,
  DataBasePostgreSQLConfigModule,
} from './config/data-base-config/data-base-config.module'
import { TrabajadoresModule } from './rest/trabajadores/trabajadores.module'
import { RestaurantesModule } from './rest/restaurantes/restaurantes.module'
import { CacheModule } from '@nestjs/cache-manager'
import { NotificationsModule } from './notifications/notifications.module'
import { PosicionesModule } from './rest/posiciones/posiciones.module'
import { ClientesModule } from './rest/clientes/clientes.module'
import { CorsConfigModule } from './config/cors/cors.module'
import { ProveedoresModule } from './rest/proveedores/proveedores.module'
import { ProductosModule } from './rest/productos/productos.module'
import { LocaleConfigModule } from './config/locale-config/locale-config.module'
import { AuthModule } from './rest/auth/auth.module'
import { UsersModule } from './rest/usuarios/users.module'

@Module({
  imports: [
    ConfigModule.forRoot(
      process.env.NODE_ENV === 'dev'
        ? { envFilePath: '.env.dev' || '.env' }
        : { envFilePath: '.env.prod' },
    ),
    //locale config
    LocaleConfigModule,
    //bbdd con postgrest
    DataBasePostgreSQLConfigModule,
    //bbdd con MongoDB
    DataBaseMongoDBConfigModule,
    //entities
    AuthModule,
    UsersModule,
    TrabajadoresModule,
    PosicionesModule,
    ClientesModule,
    ProveedoresModule,
    ProductosModule,
    RestaurantesModule,
    //cache
    CacheModule.register(),
    //cors
    CorsConfigModule,
    //notifications
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
