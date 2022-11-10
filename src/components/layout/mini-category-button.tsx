import { motion } from 'framer-motion'
import { Category } from '../../models/response'
import { classNames } from '../../util/misc'

export interface MiniCategoryButtonProps extends Category {
    className?: string
    onClick?: (...args: any[]) => any
}

export const MiniCategoryButton: React.FC<MiniCategoryButtonProps> = ({
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
                'bg-white flex-shrink-0 rounded inline-flex flex-col justify-center items-center overflow-hidden mb-2 mr-2 cursor-pointer'
            )}
            style={{
                background: background_color,
            }}
            whileHover={{ scale: 1.025 }}
            onClick={onClick}
            type="button"
        >
            <div className="flex flex-col space-y-1 py-1 px-2">
                <span className="font-bold" style={{ color }}>
                    {label}
                </span>
            </div>
        </motion.button>
    )
}
