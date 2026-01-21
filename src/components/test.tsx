"use client";

import { getOrganizationsList } from "@/services/organization.services";
import { getConnectedProductsList } from "@/services/product.services";
import {
  PurchaseRequestStatus,
  TreasuryPriority,
  TreasuryRequestTypes,
} from "@/types/treasury-enums";
import {
  CreatePlanRequestPayload,
  CreatePurchaseRequestPayload,
  PurchaseRequest,
  PurchaseRequestLinePayload,
} from "@/types/treasury-types";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Steps,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { ROLES } from "../../config/permissions";
import useDebounce from "../../hooks/useDebounce";
import { GetMeasurementUnitTypes } from "../../services/basic.service";
import { getdepartmentList } from "../../services/department.services";
import {
  GetInvestProjectsByOrg,
  getLimits,
  getPurchaseRequests,
} from "../../services/treasury";
import { useUserStore } from "../../store/userStore";
import { StepGeneralInfo } from "./StepGeneralInfo";
import { StepRequestLines } from "./StepRequestLines";

const { Option } = Select;
const { Text } = Typography;

interface PurchaseRequestFormProps {
  initialValues?: PurchaseRequest;
  onSubmit: (values: CreatePurchaseRequestPayload) => void;
  isLoading?: boolean;
}

export const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const { user, hasRole } = useUserStore();
  const isOrgUser =
    hasRole(ROLES.ROLE_ORGANIZATION) || hasRole(ROLES.ROLE_DEPARTMENT_WORKER);
  const [form] = Form.useForm();
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [selectedDepId, setSelectedDepId] = useState<number | null>(null);
  const [searchConnectedValue, setSearchConnectedValue] = useState<
    string | undefined
  >(undefined);
  const debouncedConnectedValue = useDebounce(searchConnectedValue, 500);

  const [depSearchQuery, setDepSearchQuery] = useState<string>("");
  const depDebouncedSearch = useDebounce(depSearchQuery, 500);

  const [orgSearchQuery, setOrgSearchQuery] = useState<string>("");
  const orgDebouncedSearch = useDebounce(orgSearchQuery, 500);

  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    mxikKod: string;
    productName: string;
  } | null>(null);

  useEffect(() => {
    if (isOrgUser && user?.organizationId) {
      const orgId = Number(user.organizationId);
      setSelectedOrgId(orgId);
      form.setFieldsValue({ organizationId: orgId });
    }
    if (isOrgUser && user?.departmentId) {
      const depId = Number(user.departmentId);
      setSelectedDepId(depId);
      form.setFieldsValue({ departmentId: depId });
    }
  }, [isOrgUser, user, form]);

  // Fetch Organizations
  const { data: orgsData } = useQuery({
    queryKey: ["organizations", "list", orgDebouncedSearch],
    queryFn: () =>
      getOrganizationsList({
        page: 0,
        size: 100,
        query: orgDebouncedSearch,
      }).then((res) => res.content),
  });

  // Fetch Departments based on Org
  const { data: deptsData } = useQuery({
    queryKey: ["departments", selectedOrgId, depDebouncedSearch, selectedDepId],
    queryFn: () =>
      getdepartmentList({
        page: 0,
        size: 10,
        organizationId: selectedOrgId,
        search: depDebouncedSearch,
        departmentId: selectedDepId,
      }),
    enabled: !!selectedOrgId,
  });

  const MeasurementUnitTypes = useQuery({
    queryKey: ["measurement-unit-types"],
    queryFn: () => GetMeasurementUnitTypes(),
  });

  const InvestmentProjects = useQuery({
    queryKey: ["investment-projects", selectedOrgId],
    queryFn: () => selectedOrgId && GetInvestProjectsByOrg(selectedOrgId),
    enabled: !!selectedOrgId,
  });

  const Limits = useQuery({
    queryKey: ["limits", selectedOrgId],
    queryFn: () => getLimits(selectedOrgId!, { page: 0, size: 100 }),
    enabled: !!selectedOrgId,
  });

  const { data: prData } = useQuery({
    queryKey: ["purchase-requests", "approved", selectedOrgId],
    queryFn: () => getPurchaseRequests(selectedOrgId, { page: 0, size: 100 }),
    // Ideally filter status=APPROVED in API search params, currently fetch all and filter in frontend or assume user selects from ID
  });

  const LimitOptions = Limits.data?.content.map((limit) => ({
    value: limit.id,
    label: limit.name ?? `Лимит ${limit.organizationName}`,
  }));

  // Fetch MDM Items (Products) for Search
  // Связанные продукты
  const ConnectedProductsList = useQuery({
    queryFn: () =>
      getConnectedProductsList({
        page: 0,
        size: 10,
        searchParam: debouncedConnectedValue,
      }),
    queryKey: ["connectedProducts-list", debouncedConnectedValue],
  });

  const onFinish = (values: CreatePurchaseRequestPayload) => {
    const payload: CreatePurchaseRequestPayload = {
      departmentId: values.departmentId,
      budgetYear: dayjs(values.budgetYear).format("YYYY"),
      neededDate: dayjs(values.neededDate).format("YYYY-MM-DD"),
      priority: values.priority,
      purpose: values.purpose,
      requestType: values.requestType,
      limitRegisterId: values.limitRegisterId,
      lines: values.lines.map((line: PurchaseRequestLinePayload) => ({
        corporateItemId: line.corporateItemId,
        measurementUnitCode: line.measurementUnitCode,
        quantity: line.quantity,
        estimatedPrice: line.estimatedPrice,
        supplierPreference: line.supplierPreference,
        capexOpexFlag: true,
        investmentProjectId: line.investmentProjectId,
        classification: line.classification,
      })),
    };
    onSubmit(payload);
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        neededDate: initialValues.neededDate
          ? dayjs(initialValues.neededDate)
          : null,
      });
      setSelectedOrgId(initialValues.organizationId);

      console.log("initialValues.organizationId", initialValues.organizationId);
    }
  }, [initialValues, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ lines: [] }}
      disabled={
        initialValues && initialValues.status !== PurchaseRequestStatus.DRAFT
      }
    >
      <Card title="Основная информация" className="mb-4" size="small">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            label="Организация"
            rules={[{ required: true, message: "Выберите организацию" }]}
          >
            <Select
              placeholder="Выберите организацию"
              onChange={(val) => setSelectedOrgId(val)}
              disabled={isOrgUser}
              value={selectedOrgId}
              options={orgsData?.map((org: any) => ({
                label: org.name,
                value: org.id,
              }))}
              showSearch={{
                filterOption: false,
                onSearch: (value) => setOrgSearchQuery(value),
                searchValue: orgSearchQuery,
              }}
            />
          </Form.Item>

          <Form.Item
            name="departmentId"
            label="Департамент"
            initialValue={selectedDepId}
            rules={[{ required: true, message: "Выберите департамент" }]}
          >
            <Select
              disabled={
                !selectedOrgId || selectedDepId === Number(user?.departmentId)
              }
              placeholder="Выберите департамент"
              onChange={(val) => setSelectedDepId(val)}
              value={selectedDepId}
              options={deptsData?.content.map((dept: any) => ({
                label: dept.name,
                value: dept.id,
              }))}
              showSearch={{
                filterOption: false,
                onSearch: (value) => setDepSearchQuery(value),
                searchValue: depDebouncedSearch,
              }}
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Приоритет"
            rules={[{ required: true }]}
            initialValue={TreasuryPriority.NORMAL}
          >
            <Select>
              {/* Assuming TreasuryPriority values are English enum keys, we might want to map them */}
              <Option value={TreasuryPriority.LOW}>Низкий</Option>
              <Option value={TreasuryPriority.NORMAL}>Средний</Option>
              <Option value={TreasuryPriority.HIGH}>Высокий</Option>
              <Option value={TreasuryPriority.CRITICAL}>Критический</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="neededDate"
            label="Дата потребности"
            rules={[{ required: true, message: "Укажите дату" }]}
          >
            <DatePicker
              className="w-full"
              format="DD.MM.YYYY"
              placeholder="Выберите дату"
            />
          </Form.Item>

          <Form.Item
            name="budgetYear"
            label="Бюджетный год"
            initialValue={dayjs()}
            rules={[{ required: true, message: "Укажите год" }]}
          >
            <DatePicker.YearPicker format="YYYY" className="w-full" />
          </Form.Item>

          <Form.Item
            name="requestType"
            label="Тип заявки"
            rules={[{ required: true }]}
            initialValue={TreasuryRequestTypes.GOODS}
          >
            <Select>
              <Option value={TreasuryRequestTypes.GOODS}>Товары</Option>
              <Option value={TreasuryRequestTypes.SERVICES}>Услуги</Option>
              <Option value={TreasuryRequestTypes.WORKS}>Работы</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="flex flex-row items-end gap-4 w-full">
          {/* 1. Select - Limit */}
          <Form.Item
            name="limitRegisterId"
            label="Лимит"
            rules={[{ required: true }]}
            className="flex-1 mb-0" // mb-0 pastki masofani yo'qotadi
          >
            <Select
              options={LimitOptions}
              placeholder="Лимит"
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* 2. DatePicker - Oy */}
          <Form.Item
            name="month" // Name qo'shish tavsiya etiladi
            label="месяцы"
            rules={[{ required: true, message: "Выберите месяц" }]}
            className="flex-1 mb-0"
          >
            <DatePicker
              picker="month"
              placeholder="Выберите месяц"
              style={{ width: "100%" }}
            />
          </Form.Item>

          {/* 3. TextArea - Obonovaniya */}
          <Form.Item
            name="purpose"
            label="Обоснование закупки"
            rules={[{ required: true, message: "Обоснование обязательно" }]}
            className="flex-1 mb-0"
          >
            <Input.TextArea
              rows={1}
              placeholder="Для чего требуется..."
              autoSize={{ minRows: 1, maxRows: 3 }} // TextArea balandligi moslashuvchan bo'ladi
            />
          </Form.Item>
        </div>
      </Card>
      <div className="py-1"></div>
      <Card title="Позиции заявки" className="mb-4" size="small">
        <Form.List name="lines">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="w-full grid grid-cols-12 gap-2">
                  <Form.Item
                    {...restField}
                    name={[name, "classification"]}
                    label={key === 0 ? "Классификация" : ""}
                    className="col-span-4"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Выберите классификацию">
                      <Option value="PRIMARY_PRODUCTION">
                        Основное производство
                      </Option>
                      <Option value="REPAIR_WORKS">
                        Ремонтные работы (плановые, капитальные)
                      </Option>
                      <Option value="INVESTMENT_PROJECTS">
                        Инвестиционные проекты (с указанием конкретного проекта)
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "corporateItemId"]}
                    rules={[
                      { required: true, message: "Выберите номенклатуру" },
                    ]}
                    className="col-span-4"
                    label={key === 0 ? "Номенклатура (MDM)" : ""}
                  >
                    <Select
                      placeholder="Поиск товара..."
                      loading={ConnectedProductsList.isLoading}
                      allowClear
                      showSearch
                      filterOption={false}
                      onSearch={(value) => setSearchConnectedValue(value)}
                      onChange={(value, option: any) => {
                        setSelectedProduct(option);
                      }}
                      options={ConnectedProductsList.data?.content.map(
                        (item) => ({
                          value: item.id,
                          label: item.productName,
                          mxikKod: item.mxikKod,
                          productName: item.productName,
                        }),
                      )}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    className="col-span-2 w-full"
                    label={key === 0 ? "Кол-во" : ""}
                    rules={[{ required: true, message: "Укажите кол-во" }]}
                  >
                    <Input
                      type="number"
                      min={0}
                      placeholder="Кол-во"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "measurementUnitCode"]}
                    className="col-span-2"
                    label={key === 0 ? "Ед. изм." : ""}
                    rules={[
                      {
                        required: true,
                        message: "Выберите Ед. изм.",
                      },
                    ]}
                  >
                    <Select
                      options={MeasurementUnitTypes.data}
                      placeholder="Выберите Ед. изм."
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "estimatedPrice"]}
                    className="col-span-3 w-full"
                    label={key === 0 ? "Цена" : ""}
                    rules={[
                      {
                        required: true,
                        message: "Укажите цену",
                      },
                    ]}
                  >
                    <InputNumber<number>
                      min={0}
                      placeholder="Цена"
                      className="!w-full text-right"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                      }
                      parser={(value) =>
                        value ? parseFloat(value.replace(/\s?|(,*)/g, "")) : 0
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "supplierPreference"]}
                    className="col-span-4 w-full"
                    label={key === 0 ? "Предпочтения поставщика" : ""}
                    rules={[
                      {
                        required: true,
                        message: "Укажите Предпочтения поставщика",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Укажите Предпочтения поставщика"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "investmentProjectId"]}
                    className="col-span-4"
                    label={key === 0 ? "Проект инвестирования" : ""}
                  >
                    <Select
                      options={InvestmentProjects.data}
                      placeholder="Выберите проект инвестирования"
                      disabled={!selectedOrgId}
                    />
                  </Form.Item>

                  <div className="col-span-1 flex items-center justify-center h-full pt-8">
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Добавить позицию
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      <Form.Item>
        <div className="w-full justify-end flex mt-2">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Отправить
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

// ("use client");

// export const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({
//   initialValues,
//   onSubmit,
//   isLoading,
// }) => {
//   const [form] = Form.useForm();
//   const [currentStep, setCurrentStep] = useState(0);

//   const handleNext = async () => {
//     try {
//       if (currentStep === 0) {
//         await form.validateFields([
//           "departmentId",
//           "budgetYear",
//           "neededDate",
//           "priority",
//           "purpose",
//           "requestType",
//           "limitRegisterId",
//         ]);
//       }
//       setCurrentStep((s) => s + 1);
//     } catch {}
//   };

//   const handlePrev = () => setCurrentStep((s) => s - 1);

//   const onFinish = (values: CreatePurchaseRequestPayload) => {
//     const payload: CreatePurchaseRequestPayload = {
//       departmentId: values.departmentId,
//       budgetYear: dayjs(values.budgetYear).format("YYYY"),
//       neededDate: dayjs(values.neededDate).format("YYYY-MM-DD"),
//       priority: values.priority,
//       purpose: values.purpose,
//       requestType: values.requestType,
//       limitRegisterId: values.limitRegisterId,
//       lines: values.lines.map((line: PurchaseRequestLinePayload) => ({
//         corporateItemId: line.corporateItemId,
//         measurementUnitCode: line.measurementUnitCode,
//         quantity: line.quantity,
//         estimatedPrice: line.estimatedPrice,
//         supplierPreference: line.supplierPreference,
//         capexOpexFlag: true,
//         investmentProjectId: line.investmentProjectId,
//         classification: line.classification,
//       })),
//     };
//     onSubmit(payload);
//   };

//   return (
//     <>
//       <Steps
//         current={currentStep}
//         items={[{ title: "Общая информация" }, { title: "Позиции" }]}
//         className="mb-6"
//       />

//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         initialValues={{ lines: [] }}
//       >
//         {currentStep === 0 && <StepGeneralInfo form={form} />}
//         {currentStep === 1 && <StepRequestLines form={form} />}

//         <div className="flex justify-between mt-4">
//           {currentStep > 0 && <Button onClick={handlePrev}>Назад</Button>}

//           {currentStep < 1 && (
//             <Button type="primary" onClick={handleNext}>
//               Далее
//             </Button>
//           )}

//           {currentStep === 1 && (
//             <Button type="primary" htmlType="submit" loading={isLoading}>
//               Отправить
//             </Button>
//           )}
//         </div>
//       </Form>
//     </>
//   );
// };
