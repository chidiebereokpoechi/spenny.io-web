import { motion } from 'framer-motion'
import { Category } from '../../models/response'
import { classNames } from '../../util/misc'

export interface CategoryButtonProps extends Category {
    className?: string
    onClick?: (...args: any[]) => any
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
    className,
    label,
    background_color,
    color,
    onClick,
}) => {
    return (
        <motion.button
            className={classNames(
                className,
                'bg-white flex-shrink-0 rounded-lg shadow-lg inline-flex flex-col justify-center items-center overflow-hidden mb-6 mr-6 cursor-pointer'
            )}
            style={{
                background: background_color,
            }}
            whileHover={{ scale: 1.025 }}
            onClick={onClick}
            type="button"
        >
            <div className="flex flex-col space-y-1 py-3 px-5">
                <span className="font-bold text-left" style={{ color }}>
                    {label}
                </span>
            </div>
        </motion.button>
    )
}
