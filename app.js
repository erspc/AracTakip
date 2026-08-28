let companies = [];

try {

    const storedCompanies =
        JSON.parse(
            localStorage.getItem("companies")
        );

    companies =
        Array.isArray(storedCompanies)
            ? storedCompanies
            : [];

} catch {

    companies = [];
}

let currentCompanyId = null;

let hotelStaff = [];

try {

    const storedHotelStaff =
        JSON.parse(
            localStorage.getItem("hotelStaff")
        );

    hotelStaff =
        Array.isArray(storedHotelStaff)
            ? storedHotelStaff
            : [];

} catch {

    hotelStaff = [];
}


/* =========================
   VERİ
========================= */

function saveData() {

    localStorage.setItem(
        "companies",
        JSON.stringify(companies)
    );

    localStorage.setItem(
        "hotelStaff",
        JSON.stringify(hotelStaff)
    );
}


function generateId() {

    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}


function encodeInline(value) {

    return encodeURIComponent(
        JSON.stringify(value)
    )
    .replace(/'/g, "%27");
}


/* =========================
   ANA SAYFA
========================= */

function renderHome() {

    renderCompanies();

    renderInsideCompanies();

    renderHotelStaff();
}


/* =========================
   FİRMALAR
========================= */

function renderCompanies() {

    const container =
        document.getElementById(
            "companiesContainer"
        );


    if (companies.length === 0) {

        container.innerHTML = `
            <div class="empty-card">
                Henüz kayıtlı firma yok.
            </div>
        `;

        return;
    }


    container.innerHTML =
        companies.map(company => {

            const visits =
                company.visits || [];

            const activeVisit =
                visits.find(
                    visit =>
                        !visit.exit
                );


            return `

                <div class="company-card">

                    <div
                        onclick='openCompany(JSON.parse(decodeURIComponent("${encodeInline(company.id)}")))'
                        class="company-main"
                    >

                        <div class="company-title">

                            <h3>
                                🏢
                                ${escapeHtml(
                                    company.name
                                )}
                            </h3>

                            ${
                                activeVisit
                                    ? `
                                    <span class="inside-label">
                                        🟢 İçeride
                                    </span>
                                    `
                                    : ""
                            }

                        </div>


                        <div class="company-info">

                            🚐
                            ${
                                (company.vehicles || [])
                                .length
                            }
                            araç

                        </div>

                    </div>


                    <div class="card-actions">

                        <button
                            class="edit-btn"
                            onclick='openCompanyForm(JSON.parse(decodeURIComponent("${encodeInline(company)}")))'
                        >
                            ✏️
                        </button>

                        <button
                            class="delete-btn"
                            onclick='deleteCompany(JSON.parse(decodeURIComponent("${encodeInline(company.id)}")))'
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;

        }).join("");
}


/* =========================
   İÇERİDEKİLER
========================= */

function renderInsideCompanies() {

    const container =
        document.getElementById(
            "insideCompanies"
        );

    const inside =
        companies.filter(company => {

            const visits =
                company.visits || [];

            return visits.some(
                visit =>
                    !visit.exit
            );

        });


    document.getElementById(
        "insideCount"
    ).textContent =
        inside.length;


    if (inside.length === 0) {

        container.innerHTML = `
            <div class="empty-card">
                Şu anda içeride firma yok.
            </div>
        `;

        return;
    }


    container.innerHTML =
        inside.map(company => {

            const activeVisit =
                company.visits.find(
                    visit =>
                        !visit.exit
                );


            return `

                <div
                    class="inside-card"
                    onclick='openCompany(JSON.parse(decodeURIComponent("${encodeInline(company.id)}")))'
                >

                    <div>

                        <strong>
                            🏢
                            ${escapeHtml(
                                company.name
                            )}
                        </strong>

                        <small>
                            Giriş:
                            ${formatDateTime(
                                activeVisit.entry
                            )}
                        </small>

                    </div>

                    <span>
                        →
                    </span>

                </div>

            `;

        }).join("");
}


/* =========================
   OTEL GÖREVLİLERİ
========================= */

function renderHotelStaff() {

    const container =
        document.getElementById(
            "hotelStaffContainer"
        );

    if (!container) return;

    if (hotelStaff.length === 0) {

        container.innerHTML = `
            <div class="empty-card">
                Henüz otel görevlisi eklenmedi.
            </div>
        `;

        return;
    }

    container.innerHTML =
        hotelStaff.map(staff => `

            <div class="staff-card">

                <div class="staff-card-info">

                    <strong>
                        👤
                        ${escapeHtml(staff.name)}
                    </strong>

                    <div>
                        ${escapeHtml(staff.department)}
                    </div>

                    <a href="tel:${escapeHtml(staff.phone)}">
                        📞 ${escapeHtml(staff.phone)}
                    </a>

                    ${
                        staff.note
                            ? `
                            <p>
                                📝 ${escapeHtml(staff.note)}
                            </p>
                            `
                            : ""
                    }

                </div>

                <div class="card-actions">

                    <a
                        class="call-btn"
                        href="tel:${escapeHtml(staff.phone)}"
                    >
                        📞 Ara
                    </a>

                    <button
                        class="edit-btn"
                        onclick='openHotelStaffForm(JSON.parse(decodeURIComponent("${encodeInline(staff)}")))'
                    >
                        ✏️
                    </button>

                    <button
                        class="delete-btn"
                        onclick='deleteHotelStaff(JSON.parse(decodeURIComponent("${encodeInline(staff.id)}")))'
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `).join("");
}


function openHotelStaffForm(staff = null) {

    document
        .getElementById("hotelStaffModal")
        .classList
        .remove("hidden");

    document.getElementById(
        "hotelStaffId"
    ).value = staff ? staff.id : "";

    document.getElementById(
        "hotelStaffName"
    ).value = staff ? staff.name : "";

    document.getElementById(
        "hotelStaffDepartment"
    ).value = staff ? staff.department : "";

    document.getElementById(
        "hotelStaffPhone"
    ).value = staff ? staff.phone : "";

    document.getElementById(
        "hotelStaffNote"
    ).value = staff ? staff.note || "" : "";
}


function saveHotelStaff() {

    const id =
        document.getElementById(
            "hotelStaffId"
        ).value;

    const name =
        document.getElementById(
            "hotelStaffName"
        ).value
        .trim();

    const department =
        document.getElementById(
            "hotelStaffDepartment"
        ).value
        .trim();

    const phone =
        document.getElementById(
            "hotelStaffPhone"
        ).value
        .trim();

    const note =
        document.getElementById(
            "hotelStaffNote"
        ).value
        .trim();

    if (!name || !department || !phone) {

        alert(
            "Ad, departman ve telefon alanlarını doldurunuz."
        );

        return;
    }

    if (id) {

        const staff =
            hotelStaff.find(
                staff =>
                    staff.id === id
            );

        if (staff) {
            staff.name = name;
            staff.department = department;
            staff.phone = phone;
            staff.note = note;
        }

    } else {

        const newStaff = {
            id: generateId(),
            name: name,
            department: department,
            phone: phone,
            note: note
        };

        hotelStaff.push(newStaff);

        if (currentCompanyId) {

            const company =
                companies.find(
                    company =>
                        company.id === currentCompanyId
                );

            if (company) {

                if (!company.hotelStaffIds) {
                    company.hotelStaffIds = [];
                }

                company.hotelStaffIds.push(
                    newStaff.id
                );
            }
        }
    }

    saveData();

    if (currentCompanyId) {
        renderCompanyDetail();
    } else {
        renderHome();
    }

    closeModal("hotelStaffModal");
}


function deleteHotelStaff(id) {

    const staff =
        hotelStaff.find(
            staff =>
                staff.id === id
        );

    if (!staff) return;

    const confirmed =
        confirm(
            `"${staff.name}" adlı görevli silinsin mi?`
        );

    if (!confirmed) return;

    hotelStaff =
        hotelStaff.filter(
            staff =>
                staff.id !== id
        );

    companies.forEach(company => {
        company.hotelStaffIds =
            (company.hotelStaffIds || [])
            .filter(staffId => staffId !== id);
    });

    saveData();
    renderHome();
}


/* =========================
   FİRMA FORMU
========================= */

function openCompanyForm(company = null) {

    document
        .getElementById("companyModal")
        .classList
        .remove("hidden");


    if (company) {

        document.getElementById(
            "companyFormTitle"
        ).textContent =
            "Firma Düzenle";

        document.getElementById(
            "companyId"
        ).value =
            company.id;

        document.getElementById(
            "companyName"
        ).value =
            company.name;

        document.getElementById(
            "companyNote"
        ).value =
            company.note || "";

    } else {

        document.getElementById(
            "companyFormTitle"
        ).textContent =
            "Firma Ekle";

        document.getElementById(
            "companyId"
        ).value =
            "";

        document.getElementById(
            "companyName"
        ).value =
            "";

        document.getElementById(
            "companyNote"
        ).value =
            "";
    }
}


function saveCompany() {

    const id =
        document.getElementById(
            "companyId"
        ).value;


    const name =
        document.getElementById(
            "companyName"
        ).value
        .trim();


    const note =
        document.getElementById(
            "companyNote"
        ).value
        .trim();


    if (!name) {

        alert(
            "Firma adı giriniz."
        );

        return;
    }


    if (id) {

        const company =
            companies.find(
                company =>
                    company.id === id
            );


        if (company) {

            company.name = name;

            company.note = note;
        }

    } else {

        companies.push({

            id:
                generateId(),

            name:
                name,

            note:
                note,

            vehicles: [],

            visits: [],

            hotelStaffIds: []

        });

    }


    saveData();

    renderHome();

    closeModal(
        "companyModal"
    );
}


/* =========================
   FİRMA SİL
========================= */

function deleteCompany(id) {

    const company =
        companies.find(
            company =>
                company.id === id
        );


    if (!company) return;


    const vehicleCount =
        (company.vehicles || [])
        .length;


    const confirmed =
        confirm(

            `${company.name}\n\n` +

            `${vehicleCount} araç ve tüm giriş-çıkış kayıtları ` +

            `silinecek.\n\n` +

            `Devam etmek istiyor musun?`

        );


    if (!confirmed) return;


    companies =
        companies.filter(
            company =>
                company.id !== id
        );


    saveData();

    renderHome();
}


/* =========================
   FİRMA DETAY
========================= */

function openCompany(id) {

    currentCompanyId = id;


    document
        .getElementById(
            "homeSection"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "searchResultsSection"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "companyDetailSection"
        )
        .classList
        .remove("hidden");


    renderCompanyDetail();
}


function showHome() {

    currentCompanyId = null;


    document
        .getElementById(
            "companyDetailSection"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "homeSection"
        )
        .classList
        .remove("hidden");


    renderHome();
}


/* =========================
   FİRMA DETAY
========================= */

function renderCompanyDetail() {

    const company =
        companies.find(
            company =>
                company.id === currentCompanyId
        );


    if (!company) return;


    const vehicles =
        company.vehicles || [];


    const visits =
        company.visits || [];


    const activeVisit =
        visits.find(
            visit =>
                !visit.exit
        );

    const assignedStaff =
        (company.hotelStaffIds || [])
        .map(staffId =>
            hotelStaff.find(
                staff =>
                    staff.id === staffId
            )
        )
        .filter(Boolean);


    document.getElementById(
        "companyDetail"
    ).innerHTML = `

        <div class="detail-header">

            <div class="detail-title">

                <div>

                    <h2>
                        🏢
                        ${escapeHtml(
                            company.name
                        )}
                    </h2>

                    ${
                        company.note
                            ? `
                            <div class="note-box">
                                📝
                                ${escapeHtml(
                                    company.note
                                )}
                            </div>
                            `
                            : ""
                    }

                </div>

            </div>


            ${
                activeVisit

                    ? `

                    <div class="company-status inside">

                        <strong>
                            🟢 Firma içeride
                        </strong>

                        <small>
                            Giriş:
                            ${formatDateTime(
                                activeVisit.entry
                            )}
                        </small>


                        <button
                            class="exit-btn"
                            onclick="companyExit()"
                        >
                            🔴 Firma Çıktı
                        </button>

                    </div>

                    `

                    : `

                    <div class="company-status outside">

                        <strong>
                            ⚪ Firma içeride değil
                        </strong>


                        <button
                            class="enter-btn"
                            onclick="companyEnter()"
                        >
                            🟢 Firma Geldi
                        </button>

                    </div>

                    `
            }

        </div>


        <!-- OTEL GÖREVLİLERİ -->

        <div class="detail-section staff-assignment-section">

            <div class="section-header">

                <h2>
                    📞 Aranacak Otel Görevlileri
                </h2>

            </div>

            <div class="staff-assignment-form">

                <select
                    id="hotelStaffSelect"
                >
                    <option value="">
                        Görevli seçin
                    </option>
                    ${
                        hotelStaff
                            .filter(
                                staff =>
                                    !(company.hotelStaffIds || [])
                                    .includes(staff.id)
                            )
                            .map(staff => `
                                <option value="${escapeHtml(staff.id)}">
                                    ${escapeHtml(staff.name)} -
                                    ${escapeHtml(staff.department)}
                                </option>
                            `)
                            .join("")
                    }
                </select>

                <button
                    onclick="assignHotelStaff()"
                >
                    + Görevli Ata
                </button>

                <button
                    class="secondary-button"
                    onclick="openHotelStaffForm()"
                >
                    + Yeni Görevli
                </button>

            </div>

            ${
                assignedStaff.length === 0
                    ? `
                    <div class="empty-card">
                        Bu firmaya atanmış otel görevlisi yok.
                    </div>
                    `
                    :
                    assignedStaff.map(staff => `

                        <div class="assigned-staff-card">

                            <div class="staff-card-info">

                                <strong>
                                    👤 ${escapeHtml(staff.name)}
                                </strong>

                                <div>
                                    ${escapeHtml(staff.department)}
                                </div>

                                <a href="tel:${escapeHtml(staff.phone)}">
                                    📞 ${escapeHtml(staff.phone)}
                                </a>

                                ${
                                    staff.note
                                        ? `
                                        <p>
                                            📝 ${escapeHtml(staff.note)}
                                        </p>
                                        `
                                        : ""
                                }

                            </div>

                            <div class="card-actions">

                                <a
                                    class="call-btn"
                                    href="tel:${escapeHtml(staff.phone)}"
                                >
                                    📞 Ara
                                </a>

                                <button
                                    class="remove-button"
                                    onclick='unassignHotelStaff(JSON.parse(decodeURIComponent("${encodeInline(staff.id)}")))'
                                >
                                    Bağlantıyı Kaldır
                                </button>

                            </div>

                        </div>

                    `).join("")
            }

        </div>


        <!-- ARAÇLAR -->

        <div class="detail-section">

            <div class="section-header">

                <h2>
                    🚐 Araçlar
                </h2>


                <button
                    onclick="openVehicleForm()"
                >
                    + Araç Ekle
                </button>

            </div>


            ${
                vehicles.length === 0

                    ? `

                    <div class="empty-card">

                        Bu firmaya ait araç yok.

                    </div>

                    `

                    :

                    vehicles.map(vehicle => `

                        <div class="vehicle-card">

                            <div>

                                <strong>
                                    🚐
                                    ${escapeHtml(
                                        vehicle.plate
                                    )}
                                </strong>

                                ${
                                    vehicle.note
                                        ? `
                                        <p>
                                            📝
                                            ${escapeHtml(
                                                vehicle.note
                                            )}
                                        </p>
                                        `
                                        : ""
                                }

                            </div>


                            <div class="card-actions">

                                <button
                                    class="edit-btn"
                                    onclick='openVehicleForm(JSON.parse(decodeURIComponent("${encodeInline(vehicle)}")))'
                                >
                                    ✏️
                                </button>


                                <button
                                    class="delete-btn"
                                    onclick='deleteVehicle(JSON.parse(decodeURIComponent("${encodeInline(vehicle.id)}")))'
                                >
                                    🗑️
                                </button>

                            </div>

                        </div>

                    `).join("")
            }

        </div>


        <!-- GEÇMİŞ -->

        ${
            visits.length > 0

                ? `

                <div class="detail-section">

                    <details class="visit-history">

                        <summary>
                            📋 Firma Geliş Geçmişi
                            (${visits.length})
                        </summary>


                        <div class="history-list">

                            ${
                                visits
                                    .slice()
                                    .reverse()
                                    .map(visit => `

                                        <div class="history-item">

                                            <strong>
                                                📅
                                                ${formatDate(
                                                    visit.entry
                                                )}
                                            </strong>


                                            <div>

                                                🟢
                                                ${formatTime(
                                                    visit.entry
                                                )}

                                                →

                                                ${
                                                    visit.exit

                                                        ? `
                                                        🔴
                                                        ${formatTime(
                                                            visit.exit
                                                        )}
                                                        `

                                                        : `
                                                        🟢 Hâlâ içeride
                                                        `
                                                }

                                            </div>

                                        </div>

                                    `)
                                    .join("")
                            }

                        </div>

                    </details>

                </div>

                `

                : ""
        }

    `;
}


/* =========================
   FİRMA GİRİŞ
========================= */

function companyEnter() {

    const company =
        companies.find(
            company =>
                company.id === currentCompanyId
        );


    if (!company) return;


    if (!company.visits) {

        company.visits = [];

    }


    const activeVisit =
        company.visits.find(
            visit =>
                !visit.exit
        );


    if (activeVisit) {

        alert(
            "Bu firma zaten içeride."
        );

        return;
    }


    company.visits.push({

        id:
            generateId(),

        entry:
            new Date().toISOString(),

        exit:
            null

    });


    saveData();

    renderCompanyDetail();
}


/* =========================
   FİRMA ÇIKIŞ
========================= */

function companyExit() {

    const company =
        companies.find(
            company =>
                company.id === currentCompanyId
        );


    if (!company) return;


    if (!company.visits) {

        company.visits = [];

    }


    const activeVisit =
        company.visits.find(
            visit =>
                !visit.exit
        );


    if (!activeVisit) {

        alert(
            "Bu firma içeride görünmüyor."
        );

        return;
    }


    activeVisit.exit =
        new Date().toISOString();


    saveData();

    renderCompanyDetail();
}


function assignHotelStaff() {

    const company =
        companies.find(
            company =>
                company.id === currentCompanyId
        );

    const select =
        document.getElementById(
            "hotelStaffSelect"
        );

    if (!company || !select || !select.value) return;

    if (!company.hotelStaffIds) {
        company.hotelStaffIds = [];
    }

    if (
        !company.hotelStaffIds.includes(
            select.value
        )
    ) {
        company.hotelStaffIds.push(
            select.value
        );
    }

    saveData();
    renderCompanyDetail();
}


function unassignHotelStaff(staffId) {

    const company =
        companies.find(
            company =>
                company.id === currentCompanyId
        );

    if (!company) return;

    company.hotelStaffIds =
        (company.hotelStaffIds || [])
        .filter(
            assignedId =>
                assignedId !== staffId
        );

    saveData();
    renderCompanyDetail();
}


/* =========================
   ARAÇ
========================= */

function openVehicleForm(vehicle = null) {

    document
        .getElementById(
            "vehicleModal"
        )
        .classList
        .remove("hidden");


    if (vehicle) {

        document.getElementById(
            "vehicleId"
        ).value =
            vehicle.id;


        document.getElementById(
            "vehiclePlate"
        ).value =
            vehicle.plate;


        document.getElementById(
            "vehicleNote"
        ).value =
            vehicle.note || "";

    } else {

        document.getElementById(
            "vehicleId"
        ).value =
            "";

        document.getElementById(
            "vehiclePlate"
        ).value =
            "";

        document.getElementById(
            "vehicleNote"
        ).value =
            "";

    }
}


function saveVehicle() {

    const company =
        companies.find(
            company =>
                company.id === currentCompanyId
        );


    if (!company) return;


    if (!company.vehicles) {

        company.vehicles = [];

    }


    const id =
        document.getElementById(
            "vehicleId"
        ).value;


    const plate =
        document.getElementById(
            "vehiclePlate"
        ).value
        .trim()
        .toUpperCase();


    const note =
        document.getElementById(
            "vehicleNote"
        ).value
        .trim();


    if (!plate) {

        alert(
            "Plaka giriniz."
        );

        return;
    }


    if (id) {

        const vehicle =
            company.vehicles.find(
                vehicle =>
                    vehicle.id === id
            );


        if (vehicle) {

            vehicle.plate =
                plate;

            vehicle.note =
                note;

        }

    } else {

        company.vehicles.push({

            id:
                generateId(),

            plate:
                plate,

            note:
                note

        });

    }


    saveData();

    renderCompanyDetail();

    closeModal(
        "vehicleModal"
    );
}


function deleteVehicle(id) {

    const company =
        companies.find(
            company =>
                company.id === currentCompanyId
        );


    if (!company) return;


    company.vehicles =
        company.vehicles.filter(
            vehicle =>
                vehicle.id !== id
        );


    saveData();

    renderCompanyDetail();
}


function renderHotelStaffSearchResult(staff) {

    const assignedCompanies =
        companies
        .filter(company =>
            (company.hotelStaffIds || [])
            .includes(staff.id)
        )
        .map(company => company.name);

    return `

        <div class="search-card staff-search-card">

            <strong>
                👤 ${escapeHtml(staff.name)}
            </strong>

            <div class="search-detail">
                ${escapeHtml(staff.department)}
            </div>

            <div class="search-detail">
                📞
                <a href="tel:${escapeHtml(staff.phone)}">
                    ${escapeHtml(staff.phone)}
                </a>
            </div>

            ${
                assignedCompanies.length > 0
                    ? `
                    <div class="search-detail">
                        🏢 Atandığı firmalar:
                        ${assignedCompanies
                            .map(company => escapeHtml(company))
                            .join(", ")}
                    </div>
                    `
                    : `
                    <div class="search-detail">
                        Henüz firmaya atanmadı.
                    </div>
                    `
            }

        </div>

    `;
}


/* =========================
   ARAMA
========================= */

function searchCompanies(query) {

    query =
        query
        .toLowerCase()
        .trim();


    const resultsSection =
        document.getElementById(
            "searchResultsSection"
        );


    const resultsContainer =
        document.getElementById(
            "searchResults"
        );


    if (!query) {

        resultsSection
            .classList
            .add("hidden");

        document
            .getElementById(
                "companyDetailSection"
            )
            .classList
            .add("hidden");

        document
            .getElementById(
                "homeSection"
            )
            .classList
            .remove("hidden");

        return;
    }


    document
        .getElementById(
            "homeSection"
        )
        .classList
        .add("hidden");

    document
        .getElementById(
            "companyDetailSection"
        )
        .classList
        .add("hidden");


    resultsSection
        .classList
        .remove("hidden");


    const results =
        companies.filter(company => {

            const companyName =
                company.name
                .toLowerCase();


            const companyNote =
                (
                    company.note || ""
                )
                .toLowerCase();


            const vehicleMatch =
                (
                    company.vehicles || []
                )
                .some(
                    vehicle =>
                        vehicle.plate
                        .toLowerCase()
                        .includes(query)
                );


            const staffMatch =
                (company.hotelStaffIds || [])
                .some(staffId => {

                    const staff =
                        hotelStaff.find(
                            staff =>
                                staff.id === staffId
                        );

                    if (!staff) return false;

                    return [
                        staff.name,
                        staff.department,
                        staff.phone,
                        staff.note || ""
                    ]
                    .some(value =>
                        value
                        .toLowerCase()
                        .includes(query)
                    );
                });


            return (

                companyName.includes(
                    query
                )

                ||

                companyNote.includes(
                    query
                )

                ||

                vehicleMatch

                ||

                staffMatch

            );

        });


    const matchingStaff =
        hotelStaff.filter(staff =>
            [
                staff.name,
                staff.department,
                staff.phone,
                staff.note || ""
            ]
            .some(value =>
                value
                .toLowerCase()
                .includes(query)
            )
        );


    if (results.length === 0) {

        if (matchingStaff.length > 0) {

            resultsContainer.innerHTML =
                matchingStaff
                .map(staff => renderHotelStaffSearchResult(staff))
                .join("");

            return;
        }

        resultsContainer.innerHTML = `

            <div class="empty-card">

                Sonuç bulunamadı.

            </div>

        `;

        return;
    }


    resultsContainer.innerHTML =
        matchingStaff
            .map(staff =>
                renderHotelStaffSearchResult(staff)
            )
            .join("") +
        results.map(company => {

            const activeVisit =
                (
                    company.visits || []
                )
                .find(
                    visit =>
                        !visit.exit
                );


            const matchingVehicles =
                (
                    company.vehicles || []
                )
                .filter(
                    vehicle =>
                        vehicle.plate
                        .toLowerCase()
                        .includes(query)
                );


            const matchingStaff =
                (company.hotelStaffIds || [])
                .map(staffId =>
                    hotelStaff.find(
                        staff =>
                            staff.id === staffId
                    )
                )
                .filter(staff =>
                    staff && [
                        staff.name,
                        staff.department,
                        staff.phone,
                        staff.note || ""
                    ]
                    .some(value =>
                        value
                        .toLowerCase()
                        .includes(query)
                    )
                );


            return `

                <div
                    class="search-card"
                    onclick='openCompany(JSON.parse(decodeURIComponent("${encodeInline(company.id)}")))'
                >

                    <div class="search-company">

                        <strong>
                            🏢
                            ${escapeHtml(
                                company.name
                            )}
                        </strong>


                        ${
                            activeVisit

                                ? `
                                <span class="inside-label">
                                    🟢 İçeride
                                </span>
                                `

                                : ""
                        }

                    </div>


                    ${
                        matchingVehicles.length

                            ? `

                            <div class="search-detail">

                                🚐

                                ${
                                    matchingVehicles
                                        .map(
                                            vehicle =>
                                                escapeHtml(
                                                    vehicle.plate
                                                )
                                        )
                                        .join(", ")
                                }

                            </div>

                            `

                            : ""
                    }


                    ${
                        matchingStaff.length
                            ? `
                            <div class="search-detail">
                                📞
                                ${matchingStaff.map(staff => `
                                    ${escapeHtml(staff.name)} -
                                    ${escapeHtml(staff.department)}
                                `).join(", ")}
                            </div>
                            `
                            : ""
                    }


                    <small>
                        Detayları görmek için dokun
                    </small>

                </div>

            `;

        }).join("");
}


function clearSearch() {

    document.getElementById(
        "searchInput"
    ).value = "";


    document
        .getElementById(
            "searchResultsSection"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "homeSection"
        )
        .classList
        .remove("hidden");

}


/* =========================
   AYARLAR
========================= */

function openSettings() {

    document
        .getElementById(
            "settingsModal"
        )
        .classList
        .remove("hidden");

    updateThemeButton();
}


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    localStorage.setItem(
        "theme",
        document.body.classList.contains(
            "dark"
        )
            ? "dark"
            : "light"
    );


    updateThemeButton();
}


function updateThemeButton() {

    const button =
        document.getElementById(
            "themeButton"
        );


    const dark =
        document.body.classList.contains(
            "dark"
        );


    button.textContent =
        dark
            ? "☀️ Açık"
            : "🌙 Koyu";
}


function loadTheme() {

    const theme =
        localStorage.getItem(
            "theme"
        );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }

}


/* =========================
   YEDEKLEME
========================= */

function exportData() {

    const backup = {

        version:
            1,

        createdAt:
            new Date().toISOString(),

        companies:
            companies,

        hotelStaff:
            hotelStaff

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const a =
        document.createElement(
            "a"
        );


    const date =
        new Date()
        .toISOString()
        .slice(
            0,
            10
        );


    a.href =
        url;


    a.download =
        `firma-takip-yedek-${date}.json`;


    a.click();


    URL.revokeObjectURL(
        url
    );


    alert(
        "Yedekleme tamamlandı."
    );
}


function importData(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function(e) {

            try {

                const backup =
                    JSON.parse(
                        e.target.result
                    );

                const validCompanies =
                    backup &&
                    Array.isArray(
                        backup.companies
                    ) &&
                    backup.companies.every(
                        company =>
                            company &&
                            typeof company === "object" &&
                            company.id !== undefined &&
                            typeof company.name === "string" &&
                            company.name.trim().length > 0 &&
                            Array.isArray(
                                company.hotelStaffIds || []
                            ) &&
                            Array.isArray(
                                company.vehicles || []
                            ) &&
                            (company.vehicles || []).every(
                                vehicle =>
                                    vehicle &&
                                    typeof vehicle === "object" &&
                                    vehicle.id !== undefined &&
                                    typeof vehicle.plate === "string"
                            ) &&
                            Array.isArray(
                                company.visits || []
                            ) &&
                            (company.visits || []).every(
                                visit =>
                                    visit &&
                                    typeof visit === "object" &&
                                    visit.id !== undefined &&
                                    typeof visit.entry === "string" &&
                                    (visit.exit === null ||
                                        typeof visit.exit === "string")
                            )
                    );

                const validStaff =
                    !backup.hotelStaff ||
                    (
                        Array.isArray(
                            backup.hotelStaff
                        ) &&
                        backup.hotelStaff.every(
                            staff =>
                                staff &&
                                typeof staff === "object" &&
                                staff.id !== undefined &&
                                typeof staff.name === "string" &&
                                typeof staff.department === "string" &&
                                typeof staff.phone === "string"
                        )
                    );


                if (
                    !validCompanies
                    ||
                    !validStaff
                ) {

                    throw new Error();

                }


                const confirmed =
                    confirm(

                        "Mevcut verilerin üzerine yedek verisi yüklenecek.\n\n" +

                        "Devam etmek istiyor musun?"

                    );


                if (!confirmed) return;


                companies =
                    backup.companies.map(
                        company => ({
                            ...company,
                            id: String(company.id),
                            name: company.name.trim(),
                            note: company.note || "",
                            hotelStaffIds: (company.hotelStaffIds || [])
                                .map(staffId => String(staffId)),
                            vehicles: (company.vehicles || []).map(
                                vehicle => ({
                                    ...vehicle,
                                    id: String(vehicle.id),
                                    plate: vehicle.plate.trim(),
                                    note: vehicle.note || ""
                                })
                            ),
                            visits: (company.visits || []).map(
                                visit => ({
                                    ...visit,
                                    id: String(visit.id),
                                    exit: visit.exit || null
                                })
                            )
                        })
                    );

                hotelStaff =
                    (backup.hotelStaff || []).map(
                        staff => ({
                            ...staff,
                            id: String(staff.id),
                            name: staff.name.trim(),
                            department: staff.department.trim(),
                            phone: staff.phone.trim(),
                            note: staff.note || ""
                        })
                    );


                saveData();

                closeModal(
                    "settingsModal"
                );

                showHome();


                alert(
                    "Yedek başarıyla geri yüklendi."
                );


            } catch {

                alert(
                    "Yedek dosyası geçersiz."
                );

            }

        };


    reader.readAsText(
        file
    );


    event.target.value =
        "";
}


/* =========================
   TARİH
========================= */

function formatDateTime(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    return date.toLocaleString(
        "tr-TR",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );
}


function formatDate(
    dateString
) {

    return new Date(
        dateString
    )
    .toLocaleDateString(
        "tr-TR",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"

        }
    );

}


function formatTime(
    dateString
) {

    return new Date(
        dateString
    )
    .toLocaleTimeString(
        "tr-TR",
        {
            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}


function updateLiveDateTime() {

    const element =
        document.getElementById(
            "liveDateTime"
        );

    if (!element) return;

    const now =
        new Date();

    element.textContent =
        now.toLocaleDateString(
            "tr-TR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
}


/* =========================
   MODAL
========================= */

function closeModal(id) {

    document
        .getElementById(id)
        .classList
        .add("hidden");

}


/* =========================
   GÜVENLİ HTML
========================= */

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;
}


/* =========================
   ARAMA DİNLE
========================= */

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        function() {

            searchCompanies(
                this.value
            );

        }
    );


/* =========================
   BAŞLANGIÇ
========================= */

loadTheme();

renderHome();

updateLiveDateTime();


/* =========================
   PWA
========================= */

if (
    "serviceWorker"
    in navigator
) {

    navigator.serviceWorker.register(
        "sw.js"
    );

}