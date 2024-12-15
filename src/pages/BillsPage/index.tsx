import { Button, Col, Container, Form, Input, Row } from "reactstrap";
import { T_Bill } from "../../modules/types";
import BillCard from "../../components/BillCard";
import { BillMocks } from "../../modules/mocks";
import { FormEvent, useEffect } from "react";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store";
import { setBillName } from "src/searchSlice";
import "./index.css";

type BillsPageProps = {
    bills: T_Bill[],
    setBills: React.Dispatch<React.SetStateAction<T_Bill[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const BillsPage = ({ bills, setBills, isMock, setIsMock }: BillsPageProps) => {
    const billName = useSelector((state: RootState) => state.search.billName);
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/bills/search/?bill_name=${billName.toLowerCase()}`, { signal: AbortSignal.timeout(1000) });
            const data = await response.json();
            setBills(data.bills);
            setIsMock(false);
        } catch {
            createMocks();
        }
    }
    
    const createMocks = () => {
        setIsMock(true);
        setBills(BillMocks.filter(bill => bill.name.toLowerCase().includes(billName.toLowerCase())));
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isMock) {
            createMocks();
        } else {
            await fetchData();
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    
    return (
        <Container className="container-custom">
            <Row className="justify-content-center mb-5"> {/* Центрируем ряд */}
                <Col xs="12" md="8" lg="6"> {/* Центрируем содержимое и ограничиваем ширину */}
                    <Form onSubmit={handleSubmit} className="d-flex">
                        <Input
                            value={billName}
                            onChange={(e) => dispatch(setBillName(e.target.value))}
                            placeholder="Поиск..."
                            className="me-2 search-input"
                        />
                        <Button color="primary" className="search-button">
                            Поиск
                        </Button>
                    </Form>
                </Col>
            </Row>
            <div className="bill-grid">
                {bills?.map((bill) => (
                    <div key={bill.id} className="bill-card-col-3">
                        <BillCard bill={bill} isMock={isMock} />
                    </div>
                 ))}
            </div>
        </Container>
    );   
};

export default BillsPage;