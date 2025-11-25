const { z } = require("zod");

const attendanceSchema = z.object({
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
    .string({
      required_error: "timestamp is required",
    })
    .transform((value) => {
      const iso = new Date(value).toISOString();
      if (iso === "Invalid Date") throw new Error("Invalid timestamp format");
      return iso; // Convert to ISO
    }),

  type: z
    .string({
      required_error: "type is required",
    })
    .transform((val) => val.toUpperCase()) // normalize
    .refine((val) => val === "IN" || val === "OUT", {
      message: "type must be IN or OUT",
    }),
});

module.exports = { attendanceSchema };
