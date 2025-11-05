export async function fetchProducts() {
    const response = await fetch("https://importadoramiranda.com/api/lupe/categorias")
    const data = await response.json()
  
    // Flatten all products from all categories into a single array
    const products = data.flatMap((category: any) =>
      category.productos.map((product: any) => ({
        ...product,
        imageUrl: `https://importadoramiranda.com/storage/${product.fotos[0]?.foto}`,
      })),
    )
  
    return products
  }
  
  