import React, { useState } from 'react';
import { CompanyProfile } from '@/lib/types';
import { Settings, Download, Globe, Linkedin  } from 'lucide-react';

interface CompanyProfileCardProps {
  data: CompanyProfile[];
}

type ColumnKey = keyof CompanyProfile;

interface Column {
  key: ColumnKey;
  label: string;
  priority: number;
}

const columns: Column[] = [
  { key: 'company_name', label: 'Company', priority: 1 },
  { key: 'founders', label: 'Founders', priority: 3 },
  { key: 'description', label: 'Description', priority: 2 },
  { key: 'company_website', label: 'Website', priority: 4 },
  { key: 'location', label: 'Location', priority: 5 },
  { key: 'linkedin_profile', label: 'LinkedIn', priority: 6 },
  { key: 'stealth_mode', label: 'Stealth', priority: 7 },
  { key: 'funding_status', label: 'Funding', priority: 8 },
  { key: 'key_technologies', label: 'Tech', priority: 9 },
  { key: 'founding_year', label: 'Year', priority: 10 },
];

export function Table(props: CompanyProfileCardProps) {
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(['company_name', 'description', 'founders', 'company_website']);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const nextColumn = () => {
    setCurrentColumnIndex(prevIndex =>
      prevIndex === visibleColumns.length - 1 ? prevIndex : prevIndex + 1,
    );
  };

  const prevColumn = () => {
    setCurrentColumnIndex(prevIndex =>
      prevIndex === 0 ? prevIndex : prevIndex - 1,
    );
  };

  const toggleColumn = (columnKey: ColumnKey) => {
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const renderCellContent = (
    profile: CompanyProfile,
    columnKey: ColumnKey,
  ): React.ReactNode => {
    const value = profile[columnKey];

    switch (columnKey) {
      case 'founders':
      case 'key_technologies':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'company_website':
        return value !== "null" ? (
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            Website
          </a>
        ) : (
          'N/A'
        );
      case 'linkedin_profile':
        return value !== "null" ? (
          <a
            href={value as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            LinkedIn
          </a>
        ) : (
          'N/A'
        );
      case 'stealth_mode':
        const stealthValue = value as unknown;
        if (typeof stealthValue === 'boolean') {
          return stealthValue ? 'Yes' : 'No';
        }
        return 'No';
      default:
        return value;
    }
  };

  const convertToCSV = (data: CompanyProfile[]) => {
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(profile => 
      columns.map(col => {
        let value = profile[col.key];
        if (Array.isArray(value)) {
          value = value.join('; ');
        }
        if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`;
        }
        return value;
      }).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(props.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'company_profiles.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-50 text-gray-600">
              <tr>
                {visibleColumns.map(columnKey => {
                  const column = columns.find(col => col.key === columnKey);
                  return column ? (
                    <th key={column.key} scope="col" className="px-4 py-3 font-medium">
                      {column.label}
                    </th>
                  ) : null;
                })}
              </tr>
            </thead>
            <tbody>
              {props.data.map((profile, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                  {visibleColumns.map(columnKey => (
                    <td key={columnKey} className="px-4 py-3">
                      {renderCellContent(profile, columnKey)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-t border-gray-200">
          <button 
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
          >
            <Settings size={16} className="mr-1" />
            <span className="text-sm">Configure columns</span>
          </button>
          <button 
            onClick={downloadCSV}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
          >
            <Download size={16} className="mr-1" />
            <span className="text-sm">Download CSV</span>
          </button>
        </div>

        {showColumnSelector && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select visible columns:</h3>
            <div className="flex flex-wrap gap-2">
              {columns.map(column => (
                <label key={column.key} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => toggleColumn(column.key)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-gray-600">{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {props.data.map((profile, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0">
            <div className="p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{profile.company_name}</h3>
              <p className="text-sm text-gray-600 mb-2">{profile.location}</p>
              <p className="text-sm text-gray-700">{renderCellContent(profile, 'description')}</p>
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Founders:</span>
                  <p className="text-gray-800">{renderCellContent(profile, 'founders')}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Founded:</span>
                  <p className="text-gray-800">{profile.founding_year || 'N/A'}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Stealth:</span>
                  <p className="text-gray-800">{renderCellContent(profile, 'stealth_mode')}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-600">Funding:</span>
                  <p className="text-gray-800">{profile.funding_status || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-medium text-gray-600">Tech:</span>
                <p className="text-gray-800">{renderCellContent(profile, 'key_technologies')}</p>
              </div>
              <div className="mt-3 flex items-center space-x-3">
                {profile.company_website && profile.company_website !== "null" && (
                  <a href={profile.company_website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                    <Globe size={16} className="mr-1" />
                    <span className="text-sm">Website</span>
                  </a>
                )}
                {profile.linkedin_profile && profile.linkedin_profile !== "null" && (
                  <a href={profile.linkedin_profile} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800">
                    <Linkedin size={16} className="mr-1" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-center items-center bg-gray-100 px-4 py-3 border-t border-gray-200">
          <button 
            onClick={downloadCSV}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
          >
            <Download size={16} className="mr-1" />
            <span className="text-sm">Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}