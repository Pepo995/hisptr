-- clean before insert
DELETE FROM event_preferences WHERE type = "design";

-- create index
CREATE UNIQUE INDEX `event_preferences_code_type_key` ON `event_preferences`(`code`, `type`);

-- adding new designs
INSERT INTO event_preferences (name, code, type)
VALUES
  ('01', 'design_1', 'design'),
  ('02', 'design_2', 'design'),
  ('03', 'design_3', 'design'),
  ('04', 'design_4', 'design'),
  ('05', 'design_5', 'design'),
  ('06', 'design_6', 'design'),
  ('07', 'design_7', 'design'),
  ('08', 'design_8', 'design'),
  ('09', 'design_9', 'design'),
  ('10', 'design_10', 'design'),
  ('11', 'design_11', 'design'),
  ('12', 'design_12', 'design'),
  ('13', 'design_13', 'design'),
  ('14', 'design_14', 'design'),
  ('15', 'design_15', 'design'),
  ('16', 'design_16', 'design'),
  ('17', 'design_17', 'design'),
  ('18', 'design_18', 'design'),
  ('19', 'design_19', 'design'),
  ('20', 'design_20', 'design'),
  ('21', 'design_21', 'design'),
  ('22', 'design_22', 'design'),
  ('23', 'design_23', 'design'),
  ('24', 'design_24', 'design'),
  ('25', 'design_25', 'design'),
  ('26', 'design_26', 'design'),
  ('27', 'design_27', 'design');