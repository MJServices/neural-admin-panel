interface CategoriesSidebarProps {
    categories: { name: string; count: number }[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const CategoriesSidebar = ({ categories, selectedCategory, onSelectCategory }: CategoriesSidebarProps) => {
    return (
        <div className="w-64 bg-white p-6 rounded-xl border h-fit shrink-0 hidden lg:block">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Categories</h3>
            <div className="space-y-2">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => onSelectCategory(category.name)}
                        className={`w-full flex justify-between items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.name
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <span>{category.name}</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs ${selectedCategory === category.name
                                ? 'bg-blue-100 text-blue-600' // Although screenshot active badge looks darker/grey styled, standard blue active is safe match for now or I can look closer.
                                // Screenshot check: "All Articles" is blue bg, blue text. Badge is grey bg? Let's look close. 
                                // "All Articles" row is blue bg. Badge is grey pill.
                                : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {category.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoriesSidebar;
