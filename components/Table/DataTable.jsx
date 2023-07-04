import {
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Tfoot,
  Input,
  Button,
  Box,
  FormLabel,
  SimpleGrid,
  Flex,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import React, { useEffect, useMemo, useState } from "react";
import DataTablePagination from "./DataTablePagination";
import FilterOptions from "./FilterOptions";
import { FaFilter } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Space } from "antd";
import CustomeModal from "../Modal/CustomeModal";
import { getNestedValue } from "../../helper";

const DataTable = ({
  title,
  data,
  filterOptions,
  loading,
  columnFields,
  actionConfig,
  refetch,
}) => {
  const textColor = useColorModeValue("gray.700", "white");
  const paginationBg = useColorModeValue("white", "gray.800");
  const tableColor = useColorModeValue("gray", "teal");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = useState({
    action: null,
    handler: null,
  });
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleActionClick = (record, action, handler) => {
    setSelectedRecord(record);
    setActive({
      action: action,
      handler: handler,
    });
    onOpen();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (option, event) => {
    const value = event.target.value;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [option]: value,
    }));
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  //helper
  const filteredData = useMemo(() => {
    let filteredData = data;

    for (const option in filterValues) {
      if (filterValues[option] !== "") {
        filteredData = filteredData.filter((item) => {
          const nestedValue = getNestedValue(item, option);
          return JSON.stringify(nestedValue).includes(filterValues[option]);
        });
      }
    }

    if (searchValue !== "") {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setCurrentPage(1);
    return filteredData;
  }, [data, filterValues, searchValue]);

  const resetFilters = () => {
    setFilterValues({});
    setSearchValue("");
  };

  const getValue = (obj, column) => {
    const { dataIndex } = column;
    if (typeof dataIndex === "string") {
      return obj[dataIndex];
    } else if (Array.isArray(dataIndex)) {
      return getNestedValue(obj, dataIndex);
    }
    return "";
  };

  const itemsPerPage = 5;

  const totalPages =
    Math.ceil(!loading && filteredData.length / itemsPerPage) || 1;

  const validCurrentPage = Math.min(currentPage, totalPages);

  const indexOfLastItem = validCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems =
    !loading && filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const columns = [...columnFields];

  if (actionConfig && actionConfig.length > 0) {
    const filteredActions = actionConfig.filter(
      (config) => config.action !== "Create"
    );

    columns.push({
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {filteredActions.map(({ action, icon, type, handler }, index) => (
            <IconButton
              key={`${action}-${index}`}
              variant={type}
              colorScheme="teal"
              aria-label={action}
              fontSize="md"
              onClick={() => handleActionClick(record, action, handler)}
              icon={icon}
            />
          ))}
        </Space>
      ),
    });
  }
  let createAction =
    actionConfig &&
    actionConfig.length > 0 &&
    actionConfig.find((config) => config.action === "Create");
  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }} gap={"14px"}>
      {active?.action !== null && (
        <CustomeModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setActive(null);
            setSelectedRecord(null);
          }}
          title={active?.action}
        >
          {actionConfig
            .find((config) => config.action === active?.action)
            ?.component({
              active: active?.action,
              record: selectedRecord,
              handler: active?.handler,
              close: onClose,
              refetch: refetch,
            })}
        </CustomeModal>
      )}
      <CardHeader
        display={"flex"}
        flexDirection={"column"}
        p="6px 0px 22px 0px"
        gap={"20px"}
      >
        <Flex justifyContent={"space-between"} alignItems="center" gap="20px">
          <Flex alignItems="center" gap="20px">
            <Text fontSize="xl" color={textColor} fontWeight="bold">
              {title}
            </Text>
            <Button
              variant="ghost"
              colorScheme="teal"
              size="xs"
              onClick={toggleFilters}
              leftIcon={<FaFilter />}
            >
              Filter
            </Button>
          </Flex>
          <Box>
            {createAction && (
              <Space>
                <Button
                  aria-label={createAction.action}
                  fontSize="sm"
                  borderRadius={"12px"}
                  color={textColor}
                  // colorScheme="teal"
                  leftIcon={createAction.icon}
                  onClick={() =>
                    handleActionClick(
                      null,
                      createAction.action,
                      createAction.handler
                    )
                  }
                >
                  {createAction.title}
                </Button>
              </Space>
            )}
          </Box>
        </Flex>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                overflow: "hidden",
              }}
            >
              <SimpleGrid
                w={"full"}
                columns={{ sm: 1, md: 2, xl: 4 }}
                gap={"20px"}
                spacing="24px"
                transition="height 0.3s ease"
                style={{
                  height: "auto",
                }}
              >
                <Box>
                  <FormLabel
                    ml={"0px"}
                    mr={"0px"}
                    fontSize={"12px"}
                    color={textColor}
                  >
                    Search
                  </FormLabel>
                  <Input
                    width={"full"}
                    placeholder="Search by name"
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </Box>
                <FilterOptions
                  filterOptions={filterOptions}
                  textColor={textColor}
                  filterValues={filterValues}
                  handleFilterChange={handleFilterChange}
                  data={data}
                />
                <Button
                  colorScheme="teal"
                  size="md"
                  ml={2}
                  mt={"25px"}
                  onClick={resetFilters}
                  disabled={
                    Object.keys(filterValues).length === 0 && searchValue === ""
                  }
                >
                  Reset
                </Button>
              </SimpleGrid>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>
      <CardBody>
        <Table
          variant="striped"
          colorScheme={tableColor}
          color={textColor}
          transition="all 0.3s ease"
        >
          <Thead>
            <Tr my=".8rem" pl="0px" color="gray.400">
              {columns.map((column, index) => (
                <Th color="gray.400" key={index}>
                  {column.title}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody transition="all 0.3s ease">
            {isLoading ? (
              <Tr>
                <Td
                  bg={"transparent !important"}
                  colSpan={columns.length}
                  color={textColor}
                  transition="all 0.3s ease"
                  textAlign="center"
                >
                  <Text fontSize="sm" color={textColor}>
                    Loading...
                  </Text>
                </Td>
              </Tr>
            ) : currentItems.length === 0 ? (
              <Tr>
                <Td
                  bg={"transparent !important"}
                  colSpan={columns.length}
                  color={textColor}
                  transition="all 0.3s ease"
                  textAlign="center"
                >
                  <Text fontSize="sm" color={textColor}>
                    Data Not Found
                  </Text>
                </Td>
              </Tr>
            ) : (
              currentItems.map((item, index) => (
                <Tr key={index}>
                  {columns.map((column, index) => (
                    <Td
                      key={index}
                      color={textColor}
                      transition="all 0.3s ease"
                    >
                      {column.render
                        ? column.render(index, item)
                        : getValue(item, column)}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>

          <Tfoot bg={paginationBg} borderRadius={"16px"}>
            <Tr>
              <Td colSpan={columns.length}>
                <DataTablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePageChange={handlePageChange}
                />
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </CardBody>
    </Card>
  );
};

export default DataTable;
