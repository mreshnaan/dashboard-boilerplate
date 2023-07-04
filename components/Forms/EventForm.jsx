import { Box, Grid, GridItem, FormLabel, Button } from "@chakra-ui/react";
import { DatePicker, Form } from "antd";
import InputField from "../Fields/InputField";

const EventForm = ({ active, refetch, record, handler, close }) => {
  const onFinish = async (values) => {
    await handler(values, refetch);
    close();
  };

  return (
    <Form onFinish={onFinish}>
      <Box p={4}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <GridItem>
            <InputField
              label={"Event Name"}
              name={"name"}
              message={"Please enter the event name"}
              placeholder={"Enter your Event Name"}
              type={"text"}
            />
          </GridItem>
          <GridItem>
            <Box>
              <FormLabel htmlFor="eventDate">Event Date</FormLabel>
              <Form.Item
                name="eventDate"
                rules={[
                  { required: true, message: "Please select the event date" },
                ]}
              >
                <DatePicker
                  style={{ zIndex: 1500 }}
                  id="eventDate"
                  placeholder="Please select the Date"
                />
              </Form.Item>
            </Box>
          </GridItem>
        </Grid>

        <Box mt={4}>
          <InputField
            label={"Image URL"}
            name={"imageUrl"}
            message={"Please enter the image URL"}
            placeholder={"Enter your image"}
            type={"url"}
          />
        </Box>

        <Box mt={4}>
          <InputField
            label={"Venue"}
            name={"venue"}
            message={"Please enter the event venue"}
            placeholder={"Enter your Event Venue"}
            type={"text"}
          />
        </Box>

        {active.toLowerCase() !== "view" && (
          <Box display="flex" justifyContent="end" mt={4}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </Form>
  );
};

export default EventForm;
