import express from "express";

const router = express.Router();
import bodyParser from "body-parser";

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

export default router;
