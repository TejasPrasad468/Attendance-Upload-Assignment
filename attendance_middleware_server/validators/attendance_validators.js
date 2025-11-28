const { z } = require("zod");

const attendanceZodSchema = z.object({
  deviceId: z
    .string({
      required_error: "deviceId is required",
    })
    .min(1, "deviceId cannot be empty"),

  userId: z
    .string({
      required_error: "userId is required",
    })
    // Example EMP102, EMP999 → pattern check
    .regex(/^EMP\d{3}$/, "userId must follow EMP### format"),

	timestamp: z
    .string()
    .transform((value) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) throw new Error("Invalid timestamp format");
      return date.toISOString();
    }),

  type: z
    .string({
      required_error: "type is required",
    })
    .transform((val) => val.toUpperCase()) 
    .refine((val) => val === "IN" || val === "OUT", {
      message: "type must be IN or OUT",
    }),
});

module.exports = { attendanceZodSchema };
