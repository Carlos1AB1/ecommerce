import { GenericGame, GenericCartItemWithGame, GenericOrderWithItems } from './storage';
import { Game, CartItemWithGame, OrderWithItems } from '@shared/mysql-schema';

/**
 * Convierte un objeto Game de MySQL a GenericGame
 */
export function convertGameToGeneric(game: Game): GenericGame {
  return {
    ...game,
    platforms: game.platforms as unknown as number[] | null
  };
}

/**
 * Convierte un array de juegos de MySQL a GenericGame[]
 */
export function convertGamesToGeneric(games: Game[]): GenericGame[] {
  return games.map(convertGameToGeneric);
}

/**
 * Convierte un objeto CartItemWithGame de MySQL a GenericCartItemWithGame
 */
export function convertCartItemWithGameToGeneric(cartItem: CartItemWithGame): GenericCartItemWithGame {
  return {
    ...cartItem,
    game: convertGameToGeneric(cartItem.game)
  };
}

/**
 * Convierte un array de CartItemWithGame de MySQL a GenericCartItemWithGame[]
 */
export function convertCartItemsWithGameToGeneric(cartItems: CartItemWithGame[]): GenericCartItemWithGame[] {
  return cartItems.map(convertCartItemWithGameToGeneric);
}

/**
 * Convierte un objeto OrderWithItems de MySQL a GenericOrderWithItems
 */
export function convertOrderWithItemsToGeneric(order: OrderWithItems): GenericOrderWithItems {
  return {
    ...order,
    items: order.items.map(item => ({
      ...item,
      game: convertGameToGeneric(item.game)
    }))
  };
}