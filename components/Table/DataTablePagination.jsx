import { HStack, Button, Text } from "@chakra-ui/react";
import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DataTablePagination = ({ currentPage, totalPages, handlePageChange }) => {
  return (
    <HStack justify="flex-end" spacing="1rem">
      <Button
        leftIcon={<FiChevronLeft />}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      ></Button>
      <HStack>
        <Text flexShrink="0">
          Page{" "}
          <Text fontWeight="bold" as="span">
            {currentPage}
          </Text>{" "}
          of{" "}
          <Text fontWeight="bold" as="span">
            {totalPages === 0 ? 1 : totalPages}
          </Text>
        </Text>
      </HStack>
      <Button
        rightIcon={<FiChevronRight />}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      ></Button>
    </HStack>
  );
};

export default DataTablePagination;
