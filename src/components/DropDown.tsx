import {ChevronDownIcon} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';


type SearchableDropdownProps<T extends { id: string | number }> = {
    options: T[];
    fields: (keyof T)[];
    title: string;
    onSelect: (id: T['id']) => void;
    error?: string;
    required?: boolean;
    value?: string;
};


function SearchableDropdown<T extends { id: string | number }>({
                                                                   options,
                                                                   onSelect,
                                                                   title,
                                                                   error,
                                                                   fields,
                                                                   value,
                                                                   required,
                                                               }: SearchableDropdownProps<T>) {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filtered, setFiltered] = useState(options);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSearch = (value: string) => {
        setSearch(value);

        const filtered_data = options.filter(opt =>
            fields.some(field =>
                String(opt[field])
                    .toLowerCase()
                    .includes(value.toLowerCase())
            )
        );
        setFiltered(filtered_data);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node))
                setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDisplayLabel = () => {
        if (!value) return '';
        const selectedOption = options.find(opt => opt.id === value);
        return selectedOption
            ? fields.map(field => selectedOption[field]).join(' ')
            : '';
    };

    return (
        <div ref={containerRef} className="relative w-full mb-2 pr-2 text-left">
            <label className={`text - lg text-[var(--primary-text)] ${error && 'text-[var(--error)]'}`} htmlFor={title}>
                {title} <span className={"text-[var(--error)]"}>{required ? '*' : ''}</span>
            </label>
            <div className="relative ml-[-8px]">
                <input
                    type="text"
                    className={`w-full border-1 mt-1 rounded-sm ${error ? 'border-[var(--error)] text-[var(--error)] placeholder-[var(--error)]' :
                        'border-[var(--text-tertiary)]'} text-[var(--primary-text)] rounded px-3 py-2 hover:border-[var(--primary-hover)] focus:border-[var(--primary-custom)]
                        focus:ring-0 focus:ring-offset-0 focus:outline-none focus:shadow-none !ring-0 !shadow-none`}
                    value={search || getDisplayLabel()}
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {(!search && !value) &&
                    <div>
                        <div className="absolute right-3 top-[25px] transform -translate-y-1/2 pointer-events-none">
                            <ChevronDownIcon className="w-5 h-5 text-[var(--text-tertiary)]" />
                        </div>
                    </div>
                }
                {isOpen && (
                    <div className="absolute z-10 mb-2 w-full text-left text-[var(--primary-text)] bg-[var(--paper-custom)] max-h-60 overflow-y-auto rounded mt-2 shadow">
                        {filtered.length > 0 ? (
                            filtered.map((opt, idx) => (
                                <div
                                    key={idx}
                                    className="px-3 py-2 hover:bg-[var(--background)] cursor-pointer rounded-xl"
                                    onClick={(e) => {
                                        onSelect(opt.id);
                                        setSearch(e.currentTarget.textContent || '');
                                        setIsOpen(false);
                                    }}
                                >
                                    {fields.map((field) => `${opt[field]} `)}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-gray-500">No options</div>
                        )}
                    </div>
                )}
            </div>
            {error && <span className="text-red-500 text-sm mt-[-5px]">{error}</span>}
        </div>
    );
};

export default SearchableDropdown;