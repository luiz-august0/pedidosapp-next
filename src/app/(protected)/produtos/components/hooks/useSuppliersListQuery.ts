import { getSuppliersList } from '@/core/suppliers/services/suppliers';
import { SupplierPageResponseDTO } from '@/core/suppliers/types/dtos';
import { FilterBuilder } from '@/shared/FilterBuilder';
import { debounce } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

export default function useSuppliersListQuery() {
  const [list, setList] = useState<SupplierPageResponseDTO>();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>();

  const getMore = async (reset: boolean) => {
    if (!list?.last || reset) {
      setLoading(true);

      const filterBuilder = new FilterBuilder();

      filterBuilder.equals("active", true);

      if (query) {
        filterBuilder.like('name', query);
      }

      const data = await getSuppliersList({
        paginationDTO: {
          page: list && !reset ? list?.pageable?.pageNumber + 1 : 0,
          size: 10,
        },
        filterRequestDTO: filterBuilder.dto,
      });

      setList(list && !reset ? { ...data, content: [...list?.content, ...data?.content ]} : data);
      setLoading(false);
    }
  };

  const search = useCallback(debounce(setQuery, 500), []);

  useEffect(() => {
    getMore(true);
  }, [query]);

  return {
    getMore,
    list,
    loading,
    search
  };
}
