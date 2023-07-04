import { Box, FormLabel, Select, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { getNestedValue } from "../../helper";

const FilterOptions = ({
  filterOptions,
  textColor,
  filterValues,
  handleFilterChange,
  data,
}) => {

  return (
    <>
      {/* <SimpleGrid
        w="full"
        columns={{ sm: 1, md: 2, xl: 4 }}
        spacing="24px"
        alignItems="center"
      > */}
      {filterOptions?.map((option) => (
        <Box
          key={option}
          style={{
            display: "flex",
            justifyContent: "start",
            flexDirection: "column",
          }}
        >
          <FormLabel
            ml="11px"
            mr="0px"
            fontSize="12px"
            htmlFor={`filterBy${option}`}
            color={textColor}
          >
            {option
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
              .split(".")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </FormLabel>
          <Select
            color={textColor}
            key={option}
            ml="2"
            value={filterValues[option] || ""}
            onChange={(event) => handleFilterChange(option, event)}
          >
            <option value="">All</option>
            {Array.from(
              new Set(data.map((item) => getNestedValue(item, option)))
            ).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Box>
      ))}
      {/* </SimpleGrid> */}
    </>
  );
};

export default FilterOptions;
