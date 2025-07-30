'use client'

import React, { useState, useEffect } from 'react'
import { useAppContext } from '@/lib/app-context'
import productApi from "@/lib/api/product.api"
import categoryApi from "@/lib/api/category.api"
import SearchFilter from "@/components/home/product-search-filter"
import HomeHeader from "@/components/home/home-header"
import ProductList from "@/components/home/product-list"
import ProductPagination from "@/components/home/product-pagination"
import { Product, ProductCategory } from "@/lib/types/product.type"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(6)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories only once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const category = await categoryApi.getCategories()
        setCategories(category)
      } catch {
        setError('Không thể tải danh mục sản phẩm')
      }
    }

    fetchCategories()
  }, [])

  // Fetch products whenever filters or pagination change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const productResponse = await productApi.getProducts({
          searchName: searchTerm,
          categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
          pageNumber,
          pageSize,
        })

        setProducts(productResponse.items)
        setTotalPages(productResponse.totalPages || 1)
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchTerm, selectedCategory, pageNumber, pageSize])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <HomeHeader />

        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        <div className="flex-1">
          <ProductList
            products={products}
            loading={loading}
            error={error}
          />
        </div>

        {totalPages > 1 && (
          <ProductPagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            setPageNumber={setPageNumber}
          />
        )}
      </div>
    </div>
  )
}
