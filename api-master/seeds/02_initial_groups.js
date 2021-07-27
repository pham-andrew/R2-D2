exports.seed = function (knex) {

  return knex("groups")
    .del()
    .then(function () {
      return knex("groups").insert([
              {
                name: "CC"
              },
              {
                name: "CSS",
                parent_id: 1
              },
              {
                name: "Division",
              },
              {
                name: "Chief Engineer",
                parent_id: 3
              },
              {
                name: "Branch",
                parent_id: 4
              },
              {
                name: "SEIT Segment",
                parent_id: 5
              },
              {
                name: "Ground Segment",
                parent_id: 5
              },
              {
                name: "Engineer",
                parent_id: 6
              },
      ]);
  });
};
