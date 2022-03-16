import router from "../router/index.js";
import Category from "../models/Category.js";

// CREATES A NEW RECORD
router.post("/category", (req, res) => {
  Category.create(
    {
      id: req.body.id,
      name: req.body.name,
      items: req.body.items || [],
    },
    (err, category) => {
      if (err)
        return res.status(500).send({
          msg: "There was a problem adding the information to the database.",
          err,
        });
      res.status(200).send({ data: category });
    }
  );
});

// RETURNS ALL USERS IN THE DATABASE
router.get("/category", (_req, res) => {
  Category.find({}, (err, category) => {
    if (err)
      return res
        .status(500)
        .send({ msg: "There was a problem finding the madafakas.", err });
    res.status(200).send({ data: category });
  });
});

// GETS A SINGLE RECORD FROM THE DATABASE
router.get("/category/:id", (req, res) => {
  Category.findById(req.params.id, (err, category) => {
    if (err && err.value !== req.params.id)
      return res
        .status(500)
        .send({ msg: "There was a problem finding the category.", err });
    if (!category) return res.status(404).send({ msg: "No category found." });
    res.status(200).send({ data: category });
  });
});

// DELETES A RECORD FROM THE DATABASE
router.delete("/category/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id, (err, category) => {
    if (err)
      return res
        .status(500)
        .send({ msg: "There was a problem deleting the category.", err });
    res.status(200).send({ msg: `Category ${category.name} was deleted.` });
  });
});

// UPDATES A SINGLE RECORD IN THE DATABASE
router.put("/category/:id", (req, res) => {
  Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, category) => {
      if (err)
        return res
          .status(500)
          .send({ msg: "There was a problem updating the category.", err });
      res.status(200).send({ data: category });
    }
  );
});

export default router;
