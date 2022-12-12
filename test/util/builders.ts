export function newPlanet() {
  return {
    name: Math.random().toString(),
    climate: 'arid',
    terrain: 'desert',
    films: [newFilm(), newFilm()]
  }
}

export function newFilm() {
  return {
    title: '',
    director: '',
    release_date: '2002-05-16'
  }
}