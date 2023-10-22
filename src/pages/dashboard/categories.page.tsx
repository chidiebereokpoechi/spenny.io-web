import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { PrimaryButton } from '../../components/buttons'
import { CategoryButton, DashboardPageWrapper, Loader } from '../../components/layout'
import { Category } from '../../models/response'
import { useStores } from '../../util/stores'
import { CreateCategoryModal, UpdateCategoryModal } from './modals'

export const CategoriesPage: React.FC = observer(() => {
    const { categoriesStore } = useStores()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState<Category | null>(null)
    const categories = categoriesStore.categories
    const categoriesLoading = categoriesStore.loading

    const openModal = useCallback(() => {
        setIsCreateModalOpen(true)
    }, [])

    const clickCategoryButton = useCallback((category: Category) => {
        return () => {
            setActiveCategory(category)
            setIsUpdateModalOpen(true)
        }
    }, [])

    useEffect(() => {
        const subscription = categoriesStore.listCategories().subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [categoriesStore])

    return (
        <DashboardPageWrapper>
            <Loader loading={categoriesLoading}>
                {activeCategory && (
                    <UpdateCategoryModal
                        isOpen={isUpdateModalOpen}
                        setIsOpen={setIsUpdateModalOpen}
                        category={activeCategory}
                    />
                )}
                {categories.length > 0 ? (
                    <>
                        <header className="p-4 grid grid-cols-1 gap-4">
                            <span className="text-3xl font-extrabold text-black">Categories</span>
                            <div>
                                <PrimaryButton type="button" onClick={openModal}>
                                    <span>Create new category</span>
                                </PrimaryButton>
                            </div>
                        </header>
                        <main className="p-4 flex flex-wrap overflow-y-auto">
                            {categories.map((category) => (
                                <CategoryButton
                                    {...category}
                                    key={category.id}
                                    onClick={clickCategoryButton(category)}
                                />
                            ))}
                        </main>
                    </>
                ) : (
                    <main className="p-4 flex flex-col flex-1 items-center justify-center space-y-8">
                        <div className="flex flex-col space-y-1 text-center">
                            <span className="text-xl font-bold">You have no categories</span>
                            <span>They are helpful labels for your transactions</span>
                        </div>
                        <PrimaryButton type="button" onClick={openModal}>
                            <span>Create first category!</span>
                        </PrimaryButton>
                    </main>
                )}
            </Loader>
            <CreateCategoryModal isOpen={isCreateModalOpen} setIsOpen={setIsCreateModalOpen} />
        </DashboardPageWrapper>
    )
})
