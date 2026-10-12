const catalogUrl = new URL('../../../assets/models/catalog.json', import.meta.url);

export async function loadModelCatalog() {
  const response = await fetch(catalogUrl);
  if (!response.ok) throw new Error(`Unable to load model catalog (${response.status})`);
  const { models } = await response.json();
  return models.map((model) => ({
    ...model,
    url: new URL(model.url, new URL('../../../', import.meta.url)).href
  }));
}
